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
import { Category, RateType, type Contract } from "@prisma/client";
import moment, { type Moment } from "moment";
import { useEffect, type FormEventHandler } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { api } from "~/utils/api";
import { MultiContractRateHandler } from "./MultiContractRateHandler";

const schema = z.object({
  startsAt: z.date().min(new Date()),
  endsAt: z.date().min(new Date()),
  rates: z.array(
    z.object({
      rate: z.number().min(0),
      rateType: z.nativeEnum(RateType),
      category: z.nativeEnum(Category),
    })
  ),
});

type Props = {
  open: boolean;
  handleClose: () => void;
  selectedContract: Contract | undefined;
};

export const ContractModal = ({
  open,
  handleClose,
  selectedContract,
}: Props) => {
  const ctx = api.useContext();

  const { mutate: createContract } = api.contract.createOne.useMutation({
    onSuccess: () => {
      void ctx.customContract.findMany.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: updateContract } = api.contract.updateOne.useMutation({
    onSuccess: () => {
      void ctx.customContract.findMany.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event?.preventDefault();
    void handleSubmit((data) => {
      if (selectedContract) {
        updateContract({
          data: {
            startsAt: data.startsAt,
            endsAt: data.endsAt,
          },
          where: { id: selectedContract.id },
        });
      } else {
        createContract({
          data: {
            startsAt: data.startsAt,
            endsAt: data.endsAt,
            renterId: "cllsiez6g00034dagj073xgef",
          },
        });
        setValue("startsAt", new Date());
      }
      handleClose();
    })(event);
  };

  useEffect(() => {
    if (selectedContract) {
      setValue("startsAt", selectedContract.startsAt);
    } else {
      setValue("startsAt", new Date());
    }
  }, [selectedContract, setValue]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Crear rentadora</DialogTitle>
      <DialogContent sx={{ pb: 1, minWidth: 500 }}>
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
            <Typography>{errors.startsAt?.message}</Typography>
          </Stack>
          <MultiContractRateHandler
            onChangeContractRates={(rates) => setValue("rates", rates)}
            contractRates={watch("rates") ?? []}
          />
          <Typography>{errors.endsAt?.message}</Typography>
          <Button type="submit" sx={{ pt: 2 }}>
            {selectedContract ? "Editar" : "Crear"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
