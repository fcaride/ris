import { Button, Stack } from "@mui/material";
import type { Renter } from "@prisma/client";
import type {
  MUIDataTableColumnDef,
  MUIDataTableOptions,
} from "mui-datatables";
import MUIDataTable from "mui-datatables";
import { useState } from "react";
import { CreateRentalModal } from "~/components/CreateRentalModal";
import { api } from "~/utils/api";

const columns: MUIDataTableColumnDef[] = [
  {
    name: "name",
    label: "Nombre",
  },
  {
    name: "createdAt",
    label: "Fecha de creación",
    options: {
      customBodyRender: (value: Date) => new Date(value).toLocaleDateString(),
    },
  },

  {
    name: "updatedAt",
    label: "Fecha de actualización",
    options: {
      customBodyRender: (value: Date) => new Date(value).toLocaleDateString(),
    },
  },
];

const Renters = () => {
  const ctx = api.useContext();

  const [openModal, setOpenModal] = useState(false);

  const [selectedRenter, setSelectedRenter] = useState<Partial<Renter>>({
    name: "",
  });

  const { mutate: deleteRenters } = api.renter.deleteMany.useMutation({
    onSuccess: () => {
      void ctx.renter.findMany.invalidate();
    },
  });

  const { mutate: createContract } = api.contract.createOne.useMutation({});

  const { data } = api.renter.findMany.useQuery({});

  const handleCreateContract = () => {
    createContract({ data: { renter: { connect: { name: "Sancor" } } } });
  };

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
      deleteRenters({ where: { id: { in: ids } } });
    },
    onRowClick: (_, { dataIndex }) => {
      const dataRow = data ? data[dataIndex] : null;
      if (dataRow) {
        setSelectedRenter(dataRow);
        setOpenModal(true);
      }
    },
    customToolbar() {
      return (
        <Button
          variant="outlined"
          onClick={() => {
            setSelectedRenter({ name: "" });
            setOpenModal(true);
          }}
        >
          Create Renter
        </Button>
      );
    },
  };

  return (
    <Stack>
      <MUIDataTable
        title="Rentadoras"
        data={data ?? []}
        columns={columns}
        options={options}
      />
      <CreateRentalModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        selectedRenter={selectedRenter}
      />
    </Stack>
  );
};

export default Renters;
