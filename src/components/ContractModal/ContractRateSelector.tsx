import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Button, Stack, TextField } from "@mui/material";
import { Category, RateType } from "@prisma/client";
import { type ChangeEvent } from "react";
import { GenericSelect } from "./GenericSelect";
import type { ContractRateInputs } from "./MultiContractRateHandler";

type Props = {
  onChangeRate: (contractRate: ContractRateInputs | undefined) => void;
  contractRate: ContractRateInputs;
};

export const ContractRateSelector = ({ onChangeRate, contractRate }: Props) => {
  const handleChangeCategory = (category: Category) => {
    onChangeRate({ ...contractRate, category });
  };

  const handleChangeRateType = (rateType: RateType) => {
    onChangeRate({ ...contractRate, rateType });
  };
  const handleChangeRate = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRate = Number(event.target.value);
    onChangeRate({
      ...contractRate,
      rate: newRate,
    });
  };

  return (
    <Stack direction="row" justifyContent="space-between" pb={2} spacing={2}>
      <TextField
        label="Precio"
        value={contractRate.rate}
        onChange={handleChangeRate}
        type="number"
        InputProps={{ inputProps: { min: 1 } }}
      />
      <GenericSelect<Category>
        onChange={handleChangeCategory}
        value={contractRate.category}
        values={Object.values(Category)}
        label="Categoria"
      />
      <GenericSelect<RateType>
        onChange={handleChangeRateType}
        value={contractRate.rateType}
        values={Object.values(RateType)}
        label="Tipo"
      />

      <Button onClick={() => onChangeRate({ ...contractRate, deleted: true })}>
        <RemoveCircleOutlineIcon />
      </Button>
    </Stack>
  );
};
