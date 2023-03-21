import React, { useEffect, useState } from "react";

const getTestInfoData = async () => {
  return [1, 2, 3]
}

export default function Demo() {

  const [testInfo, setTestInfo] = useState<any[]>([])

  const fetchTestInfo = async () => {
    const res = await getTestInfoData()
    setTestInfo(res)
  }

  useEffect(() => {
    fetchTestInfo()
  }, [])

  return (
    <div>
      {
        testInfo.map((item, index) => {
          return (
            <div key={index}>
              <span>{item}</span>
            </div>
          )
        })
      }
    </div>
  );
}