import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";

import coinList from "../coinList";

const coins = coinList.map((item) => ({ label: item.name, value: item }));

const LabelCombobox = (props) => {
  const [selected, setSelected] = useState();
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? coins
      : coins.filter((coin) =>
          coin.value.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div>
      <label className="text-sm text-p-secondary font-normal pb-2">
        Select a coin
      </label>
      <Combobox
        value={selected}
        onChange={(data) => {
          setSelected(data);
          props.onChange(data.value);
          setQuery("");
        }}
      >
        <div className="relative mt-1">
          <div className="relative bg-layout-bg w-[256px] cursor-default overflow-hidden rounded bg-white text-left shadow-md focus:outline-none">
            <Combobox.Input
              className="w-[256px] bg-layout-bg border border-input-border h-10 rounded bg-layout-bg outline-none px-4"
              displayValue={(option) => (option ? option.label : "")}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-[256px] overflow-auto rounded-md bg-layout-bg py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredOptions.length === 0 && query !== "" ? (
                <div className="relative cursor-default text-white select-none py-2 px-4 text-slate-300">
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map((item) => (
                  <Combobox.Option
                    key={item.label}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-b-inverted text-white" : "text-gray-900"
                      }`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate text-white ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {item.label}
                        </span>
                        {selected ? (
                          <span
                            className={`text-white absolute inset-y-0 left-0 flex items-center pl-3`}
                          ></span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default LabelCombobox;
