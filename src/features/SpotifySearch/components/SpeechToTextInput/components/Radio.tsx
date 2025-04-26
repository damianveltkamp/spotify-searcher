type RadioProps = {
  label: string;
  value: string;
  name: string;
};

export const Radio = ({ name, label, value }: RadioProps) => {
  return (
    <label className="flex flex-col items-start">
      <span>{label}</span>
      <input type="radio" name={name} value={value} />
    </label>
  );
};
