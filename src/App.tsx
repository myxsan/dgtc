import { useEffect, useState } from "react";
import "./App.css";
import DataTable from "./components/data-table";
import { gql, useQuery } from "@apollo/client";
import { CountryColumn } from "./components/data-table/columns";
import { Country } from "./lib/types";

function App() {
  const [rowData, setRowData] = useState<CountryColumn[]>();

  const GET_COUNTRIES = gql`
    query GetCountries {
      countries {
        code
        continent {
          code
          name
        }
        languages {
          code
          name
        }
        name
        currency
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_COUNTRIES);

  useEffect(() => {
    if (error) console.log(error);
    if (!loading) {
      setRowData(
        data.countries.map((country: Country) => ({
          code: country.code,
          name: country.name,
          continent: country.continent.name,
          currency: country.currency
            ? country.currency
            : "No official currency",
          language: country.languages.length
            ? country.languages[0].name
            : "No official language",
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div className="w-screen h-screen px-80 py-20 bg-gradient-to-br from-gray-900 to-gray-600 overflow-hidden">
      <div className="flex flex-1 flex-wrap flex-col items-center ">
        <h1 className="my-5 text-4xl font-extrabold leading-none tracking-normal text-slate-200 sm:text-xl md:text-3xl lg:text-5xl">
          DATAGUESS TEST CASE
        </h1>
        <DataTable data={rowData ? rowData : []} />
      </div>
    </div>
  );
}

export default App;
