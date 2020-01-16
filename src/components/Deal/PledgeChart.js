import React, { useEffect, useState } from "react"
import * as d3 from 'd3'
import axios from 'axios'

const baseURL = "https://sheets.googleapis.com/v4/spreadsheets"

export default function PledgeChart ({ sheet }) {

  useEffect(() => {
    if (sheet) {
      // axios.get()
      const id = sheet.split('/')[5]
      axios.get(`${baseURL}/${id}/values/B2:B?key=AIzaSyCtq-UULpkUtZpPWhzl0s3PyKhLgsBw86w`)
        .then(({ data: { values }}) => {
          console.log(values)
        })
        .catch(console.error)
    }
  }, [sheet])

  return (
    <div className="PledgeChart">
      <div className="small-header">Pledging</div>
    </div>
  )
}