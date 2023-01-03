/* eslint-disable react/jsx-key */

import { useState } from "react";
import AlertModal from "../AlertModal";
import styles from "./Table.module.css";

// !!!!!!!!!!!!!!!!!!!!
// TODO is at line 68 !
// !!!!!!!!!!!!!!!!!!!!

interface AlertUpdate {
  date: string,
  update: string
}

interface Alert {
  alert: string,
  status: string,
  updates: AlertUpdate[]
}

export interface TableContents {
  columnTitles: string[],
  rowContents: Alert[]
}

export default function Table() {
  const [contents, useContents] = useState<TableContents>({
    columnTitles: ['Alert', 'Status', 'Updates'],
    rowContents: [
      {
        alert: 'food',
        status: 'good!',
        updates: []
      },
      {
        alert: 'water',
        status: 'low',
        updates: [{ update: 'dropped to 10% below normal', date: '11/11/2022' }]
      },
      {
        alert: 'shelter',
        status: 'terrible :(',
        updates: [{ update: 'slept on cold ground', date: '11/11/2022' }, { update: 'slept on hard concrete', date: '13/11/2022' }]
      },
      {
        alert: 'Done!',
        status: '<Dammshine>',
        updates: []
      }
    ]
  });
  // console.log("Contents:");
  console.log(contents);
  // console.log("useContents:");
  // console.log(useContents);
  // return processUpdate(contents.rowContents[0]);
  const addAlert = (alert: string) => {
    contents.rowContents.push({
      alert: "food",
      status: "",
      updates: []
    });
  }

  return (
    <>
      <AlertModal useContents={useContents}/>
      <div className={styles.myTable}>
        <div className={styles.row}>
          {contents.columnTitles.map((item) => <div className={styles.item} key={item}>{item}</div>)}
        </div>
        {contents.rowContents.map((content) => (
          <div data-testid='row' className={styles.row}>
            <div className={styles.item}>
              {content.alert}
            </div>
            <div className={styles.item}>
              {content.status}
            </div>
            <div className={styles.item}>
              <ProcessUpdate alert={content.alert} status={content.status} updates={content.updates} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/**
 * Receive object as 
 *  {
 *    alert: 'Done!',
 *    status: '<YOUR NAME>',
 *    updates: []
 *  }
 * 
 * Output a react node render updates
 */
function ProcessUpdate(content: Alert) {
  return (
    <div className={styles.item}>
      {content.updates.map(update => (
        <div className={styles.update}>
          <div className={styles.updateMessage}>
            {update.update}
          </div>
          <div className={styles.updateDates}>
            {update.date}
          </div>
        </div>
      ))}
    </div>
  )
}
