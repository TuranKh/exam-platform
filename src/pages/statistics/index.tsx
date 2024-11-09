import CustomTable, { Column } from "@/components/CustomtTable";

export default function Statistics() {
  return (
    <div>
      <h1>Statistics</h1>
      <CustomTable columns={columns} data={data} />
    </div>
  );
}

interface Person {
  name: string;
  age: number;
  email: string;
}

const data: Person[] = [
  { name: "John Doe", age: 30, email: "john@example.com" },
  { name: "Jane Smith", age: 28, email: "jane@example.com" },
];

const columns: Column<Person>[] = [
  {
    header: "Name",
    accessor: "name",
    className: "name-column",
    align: "left",
    render: (data: Person) => <strong>{data.name}</strong>,
  },
  {
    header: "Age",
    accessor: "age",
    align: "center",
    className: "age-column",
  },
  {
    header: "Email",
    accessor: "email",
    align: "left",
    render: (data: Person) => (
      <a href={`mailto:${data.email}`} className='email-link'>
        {data.email}
      </a>
    ),
  },
];
