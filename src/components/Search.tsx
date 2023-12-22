import React, { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Checkbox, CircularProgress } from "@mui/material";

interface IData {
  name: string;
  url: string;
}

const Search = () => {
  const [input, setInput] = useState("");
  const [inputSync, setInputSync] = useState("");
  const [data, setData] = useState<IData[]>([]);
  const [filteredData, setFilteredData] = useState<IData[]>();
  const [filteredDataSync, setFilteredDataSync] = useState<IData[]>();
  const [isLoading, setIsLoading] = useState(false);

  function debounce(
    func: (...args: any[]) => void,
    delay: number
  ): (...args: any[]) => void {
    let timeoutId: NodeJS.Timeout;
    return function (...args: any[]): void {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        func(...args);
        setIsLoading(false);
      }, delay);
    };
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInput(newValue);
    setIsLoading(true);
    console.log(`Input value changed: ${newValue}`);
  };

  const handleInputChangeSync = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    setInputSync(newValue);
    console.log(`Input value changed: ${newValue}`);
  };

  const handleSearch = (text: string) => {
    if (text === "") {
      setFilteredData([]);
    } else {
      setFilteredData(data.filter((i) => i.name.includes(text)));
    }
  };

  const handleSearchSync = (text: string) => {
    if (text === "") {
      setFilteredData([]);
    } else {
      setFilteredDataSync(data.filter((i) => i.name.includes(text)));
    }
  };

  useEffect(() => {
    handleSearch(input);
  }, [input]);

  useEffect(() => {
    handleSearchSync(inputSync);
  }, [inputSync]);

  const handleExitSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Escape") {
      setFilteredData([]);
      setFilteredDataSync([]);
    }
  };

  const debouncedHandleInput = debounce(handleInputChange, 500);

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=386&offset=0")
      .then(({ data }) => {
        setData(data.results);
      });
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const defaultProps = {
    options: filteredData ?? [],
    getOptionLabel: (option: IData) => option.name,
  };

  const defaultPropsSync = {
    options: filteredDataSync ?? [],
    getOptionLabel: (option: IData) => option.name,
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        Async Search
        <div>
          <Autocomplete
            {...defaultProps}
            multiple
            disableCloseOnSelect
            id="combo-box-demo"
            sx={{ width: 500 }}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  <div>{option.name}</div>
                  <div>{option.url}</div>
                </div>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pokemon"
                onChange={debouncedHandleInput}
                onKeyUp={handleExitSearch}
              />
            )}
          />
          {
            isLoading && <CircularProgress />
          }
        </div>
        <div> With description and custom results display</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 30 }}>
        Sync Search
        <div>
          <Autocomplete
            {...defaultPropsSync}
            multiple
            disableCloseOnSelect
            id="combo-box-demo"
            sx={{ width: 500 }}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  <div>{option.name}</div>
                  <div>{option.url}</div>
                </div>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pokemon"
                onChange={handleInputChangeSync}
                onKeyUp={handleExitSearch}
              />
            )}
          />
        </div>
        <div> With default display and search on focus</div>
      </div>
    </div>
  );
};

export default Search;
