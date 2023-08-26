import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import type { FormEventHandler } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { api } from "~/utils/api";

const schema = z.object({
  name: z.string().min(1).max(10),
});

type Props = {
  open: boolean;
  handleClose: () => void;
};

export const CreateRentalModal = ({ open, handleClose }: Props) => {
  const ctx = api.useContext();

  const { mutate: createRenter } = api.renter.createOne.useMutation({
    onSuccess: () => {
      void ctx.renter.findMany.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event?.preventDefault();
    void handleSubmit((data) => {
      createRenter({ data: { name: data.name } });
      setValue("name", "");
      handleClose();
    })(event);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Crear rentadora</DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        <form onSubmit={onSubmit}>
          <TextField
            {...register("name")}
            variant="outlined"
            label="Nombre"
            fullWidth
            sx={{ mt: 2 }}
          />
          <Typography>{errors.name?.message}</Typography>
          <Button type="submit" sx={{ pt: 2 }}>
            Crear
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
