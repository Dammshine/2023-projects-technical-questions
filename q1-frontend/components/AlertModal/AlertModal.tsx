import { SetStateAction, Dispatch, FormEvent } from "react";
import { TableContents } from "../Table/Table";
import { render } from "@testing-library/react";


interface AlertModalProps {
  useContents: Dispatch<SetStateAction<TableContents>>,
}

export default function AlertModal({useContents}: AlertModalProps) {
  let Update = (str: string) => {
    // console.log("Update");
    useContents(a => {
      console.log(a);
      return {
        'columnTitles': a.columnTitles,
        'rowContents': [...a.rowContents, {
          alert: str,
          status: "",
          updates: []
        }]
      }
    });
    
  }
  function onSubmitEvent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // hint: the alert given is at (e.target as any).elements[0].value - ignore typescript being annoying
    // console.log((e.target as any)[0].value);
    Update((e.target as any)[0].value);
  }
  
  return (
    <form data-testid='form' onSubmit={onSubmitEvent}>
      <label> Add new alert: </label>
      <input type='text' id='alert' name='alert' />
      <button type='submit'> Add </button>
    </form>
  )
}
