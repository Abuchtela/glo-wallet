import { ITable } from "./types";

export function Table(props: ITable) {
  return (
    <div className="my-5 ">
      <h5 className=" font-semibold mb-2">{props.title}</h5>
      <div className="relative max-h-[400px] overflow-y-scroll overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <THead data={props.headers} />
          <tbody>{props.children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function TRow(props: { td: string[] }) {
  return (
    <tr className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-300">
      {props.td.map((val, i) => (
        <td key={i} className="px-6 py-4">
          {val}
        </td>
      ))}
    </tr>
  );
}

function THead(props: { data: string[] }) {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">
      <tr>
        {props.data.map((text, i) => (
          <th scope="col" className="px-6 py-3" key={i}>
            {text}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export const splitAndAddEllipses = (input: string) =>
  input.length <= 7 ? input : input.slice(0, 7) + "...";
