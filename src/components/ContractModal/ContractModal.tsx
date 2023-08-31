import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Category, RateType } from "@prisma/client";
import moment, { type Moment } from "moment";
import { useEffect, type FormEventHandler } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import type { ContractWithData } from "~/pages/contracts";
import { api } from "~/utils/api";
import { GenericSelect } from "./GenericSelect";
import { MultiContractRateHandler } from "./MultiContractRateHandler";

const createContractSchema = z.object({
  id: z.string().optional(),
  startsAt: z.date().min(new Date()),
  endsAt: z.date().min(new Date()),
  renterId: z.string(),
  rates: z.array(
    z.object({
      id: z.string().optional(),
      rate: z.number().min(0),
      rateType: z.nativeEnum(RateType),
      category: z.nativeEnum(Category),
      deleted: z.boolean().optional(),
    })
  ),
});

type Props = {
  open: boolean;
  handleClose: () => void;
  selectedContract: ContractWithData | undefined;
};

export const ContractModal = ({
  open,
  handleClose,
  selectedContract,
}: Props) => {
  const ctx = api.useContext();

  const { mutate: createContractWithRates } =
    api.customContract.createContractWithRates.useMutation({
      onSuccess: () => {
        void ctx.customContract.findMany.invalidate();
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const { mutate: updateContract } =
    api.customContract.updateContractWithRates.useMutation({
      onSuccess: () => {
        void ctx.customContract.findMany.invalidate();
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const { data: renters } = api.renter.findMany.useQuery({});

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<z.infer<typeof createContractSchema>>({
    resolver: zodResolver(createContractSchema),
  });
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event?.preventDefault();
    void handleSubmit((data) => {
      if (selectedContract) {
        updateContract({
          id: selectedContract.id,
          rates: data.rates,
          renterId: selectedContract.renter.id,
          startsAt: data.startsAt,
          endsAt: data.endsAt,
        });
      } else {
        createContractWithRates(data);
      }
      handleClose();
    })(event);
  };

  useEffect(() => {
    if (selectedContract) {
      setValue("id", selectedContract.id);
      setValue("startsAt", selectedContract.startsAt);
      setValue("endsAt", selectedContract.endsAt);
      setValue("renterId", selectedContract.renter.id);
      setValue(
        "rates",
        selectedContract.ContractRate.map((rate) => ({
          id: rate.id,
          rate: rate.rate,
          rateType: rate.rateType,
          category: rate.category,
        }))
      );
    } else {
      reset();
    }
  }, [selectedContract, setValue, reset]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Crear rentadora</DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        <form onSubmit={onSubmit}>
          <Stack spacing={2} pt={1}>
            <DatePicker
              label="Inicio"
              value={moment(watch("startsAt"))}
              onChange={(newValue: Moment | null) => {
                if (newValue) {
                  setValue("startsAt", newValue.toDate());
                }
              }}
            />
            <DatePicker
              label="Fin"
              value={moment(watch("endsAt"))}
              onChange={(newValue: Moment | null) => {
                if (newValue) {
                  setValue("endsAt", newValue.toDate());
                }
              }}
            />
            {!selectedContract && (
              <GenericSelect<string>
                onChange={(renterName) => {
                  const renterId = renters?.find(
                    (renter) => renter.name === renterName
                  )?.id;
                  if (renterId) {
                    setValue("renterId", renterId);
                  }
                }}
                value={
                  renters?.find((renter) => renter.name === watch("renterId"))
                    ?.id
                }
                values={renters?.map((renter) => renter.name) ?? []}
                label="Rentadora"
              />
            )}
            <MultiContractRateHandler
              onChangeContractRates={(rates) => setValue("rates", rates)}
              contractRates={watch("rates") ?? []}
            />
          </Stack>

          <Typography>{errors.rates?.message}</Typography>
          <Button type="submit" sx={{ py: 2 }}>
            {selectedContract ? "Editar" : "Crear"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
