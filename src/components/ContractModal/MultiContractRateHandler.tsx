import { Button, Stack } from "@mui/material";
import { Category, RateType, type ContractRate } from "@prisma/client";
import { ContractRateSelector } from "./ContractRateSelector";

type Props = {
  onChangeContractRates: (rates: ContractRateInputs[]) => void;
  contractRates: ContractRateInputs[];
};

export type ContractRateInputs = Omit<ContractRate, "id" | "contractId">;

const initialContractRate = {
  rate: 0,
  rateType: RateType.BASIC,
  category: Category.CAT1,
};

export const MultiContractRateHandler = ({
  onChangeContractRates,
  contractRates,
}: Props) => {
  const handleContractRateChange =
    (index: number) => (newContractRate: ContractRateInputs | undefined) => {
      const copyContractRates = [...contractRates];
      if (!newContractRate) {
        copyContractRates.splice(index, 1);
      } else {
        copyContractRates[index] = newContractRate;
      }
      onChangeContractRates(copyContractRates);
    };

  return (
    <Stack>
      {contractRates.map((contractRate, index) => (
        <ContractRateSelector
          key={index}
          onChangeRate={handleContractRateChange(index)}
          contractRate={contractRate}
        />
      ))}
      <Button
        onClick={() =>
          onChangeContractRates([...contractRates, initialContractRate])
        }
      >
        Add
      </Button>
    </Stack>
  );
};
