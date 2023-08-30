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
    let value = event.target.value;
    if (value.endsWith(".")) {
      value = value.slice(-1, 1);
    }
    const newRate = value ? parseFloat(value) : 0;
    onChangeRate({
      ...contractRate,
      rate: newRate,
    });
  };

  return (
    <Stack direction="row" justifyContent="space-between" pb={2} spacing={2}>
      <TextField
        label="precio"
        value={contractRate.rate}
        onChange={handleChangeRate}
        type="number"
      />
      <GenericSelect<Category>
        onChange={handleChangeCategory}
        value={contractRate.category}
        values={Object.values(Category)}
      />
      <GenericSelect<RateType>
        onChange={handleChangeRateType}
        value={contractRate.rateType}
        values={Object.values(RateType)}
      />

      <Button onClick={() => onChangeRate(undefined)}>
        <RemoveCircleOutlineIcon />
      </Button>
    </Stack>
  );
};
