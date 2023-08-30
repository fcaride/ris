import { Button, Stack } from "@mui/material";
import type { Contract, Renter } from "@prisma/client";
import type {
  MUIDataTableColumnDef,
  MUIDataTableOptions,
} from "mui-datatables";
import MUIDataTable from "mui-datatables";
import { useState } from "react";
import { ContractModal } from "~/components/ContractModal/ContractModal";
import { api } from "~/utils/api";

const columns: MUIDataTableColumnDef[] = [
  {
    name: "renter",
    label: "Rentadora",
    options: {
      customBodyRender: (renter: Renter) => renter.name,
    },
  },
  {
    name: "startsAt",
    label: "Inicio",
    options: {
      customBodyRender: (value: Date) => new Date(value).toLocaleDateString(),
    },
  },

  {
    name: "endsAt",
    label: "Fin",
    options: {
      customBodyRender: (value: Date) => new Date(value).toLocaleDateString(),
    },
  },
];

const Contracts = () => {
  const ctx = api.useContext();

  const [openModal, setOpenModal] = useState(false);

  const [selectedContract, setSelectedContract] = useState<
    Contract | undefined
  >();

  const { mutate: deleteContracts } = api.contract.deleteMany.useMutation({
    onSuccess: () => {
      void ctx.customContract.findMany.invalidate();
    },
  });

  const { data } = api.customContract.findMany.useQuery({});

  api.contract.findMany.useQuery({ include: { renter: true } });

  const options: Partial<MUIDataTableOptions> = {
    filterType: "checkbox",
    onRowsDelete: (rowsDeleted) => {
      const ids: string[] = [];
      rowsDeleted.data.forEach((row) => {
        const dataRow = data ? data[row.dataIndex] : null;
        if (dataRow) {
          ids.push(dataRow.id);
        }
      });
      deleteContracts({ where: { id: { in: ids } } });
    },
    onRowClick: (_, { dataIndex }) => {
      const dataRow = data ? data[dataIndex] : null;
      if (dataRow) {
        setSelectedContract(dataRow);
        setOpenModal(true);
      }
    },
    customToolbar() {
      return (
        <Button
          variant="outlined"
          onClick={() => {
            setSelectedContract(undefined);
            setOpenModal(true);
          }}
        >
          Create Contract
        </Button>
      );
    },
  };

  return (
    <Stack>
      <MUIDataTable
        title="Contractos"
        data={data ?? []}
        columns={columns}
        options={options}
      />
      <ContractModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        selectedContract={selectedContract}
      />
    </Stack>
  );
};

export default Contracts;
