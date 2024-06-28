import React from 'react'
import moment from 'moment-timezone'

const ExportToCSV = ({ elements }) => {
    const fileHeaders = [
        'employee_id',
        'morning_timein',
        'morning_timeout',
        'afternoon_timein',
        'afternoon_timeout',
        'date'
    ]

    const date_today = moment.tz('Asia/Manila').format('LL')

    function convertJSONToCSV(jsonData, columnHeaders) {
    if (jsonData.length === 0) {
        return ''
    }

    const headers = columnHeaders.join(',') + '\n'
    const rows = jsonData
        .map((row) => {
            return columnHeaders.map((field) => row[field] || '').join(',')
        })
    .join('\n')
    return headers + rows
    }

    function downloadCSV(jsonData, headers) {
    const csvData = convertJSONToCSV(jsonData, headers)
    if (csvData === '') {
        alert('No data to export')
    } else {
        const blob = new Blob([csvData], { type: 'text/csvcharset=utf-8' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', 'Employee Logs '+`${date_today}`+'.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

    return (
        <button className="mb-3 p-2 border-2 bg-black text-white font-bold border-black rounded-xl shadow-md hover:!bg-slate-300 hover:!text-black"
            onClick={() => {
                downloadCSV(elements, fileHeaders)
            }}
            >
        Export Employee Log
        </button>
    )
}

export default ExportToCSV