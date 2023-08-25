import MUIDataTable, { type MUIDataTableOptions } from "mui-datatables";

const columns = [
  {
    name: "name",
    label: "Name",
  },
  {
    name: "email",
    label: "Email",
  },
  {
    name: "image",
    label: "Image",
  },
];

const options: Partial<MUIDataTableOptions> = {
  filterType: "checkbox",
};

export function Admin<T extends object>({ data }: { data: T[] }) {
  if (!data || data.length === 0) {
    return null;
  }

  const keys: string[] =
    typeof data[0] === "object" ? Object.keys(data[0]) : [];

  return (
    <MUIDataTable
      title="Usuarios"
      data={data}
      columns={columns}
      options={options}
    />
  );
}
