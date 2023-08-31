import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";

type Props<T> = {
  onChange: (category: T) => void;
  value?: T;
  values: T[];
  label: string;
};

export const GenericSelect = <T,>({
  onChange,
  value,
  values,
  label,
}: Props<T>) => {
  const handleChangeCategory = (event: SelectChangeEvent<T>) => {
    onChange(event.target.value as T);
  };

  return (
    <FormControl sx={{ width: 120 }}>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select<T> value={value} label="Category" onChange={handleChangeCategory}>
        {values.map((value: T) => (
          <MenuItem key={String(value)} value={String(value)}>
            {String(value)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
