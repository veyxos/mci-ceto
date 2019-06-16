const hours = new Map([
    [1, ["8:30", "9:00"]],
    [2, ["9:00", "9:45"]],
    [3, ["10:00", "10:45"]],
    [4, ["11:00", "11:45"]],
    [5, ["12:00", "12:45"]],
    [6, ["13:00", "13:45"]],
    [7, ["14:00", "14:45"]],
    [8, ["15:00", "15:45"]],
    [9, ["16:00", "16:45"]],
    [10, ["17:00", "17:45"]],
    [11, ["18:00", "18:45"]],
    [12, ["19:00", "19:45"]],
    [13, ["20:00", "20:45"]]
])

function bubble(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > arr[i + 1]) {
            const a = arr[i]
            const b = arr[i + 1]
            arr[i] = b
            arr[i + 1] = a
        }
    }
    return arr
}

const data = JSON.parse(document.getElementById("data").innerText)

const loader = document.querySelector("#loader")
const wrapper = document.querySelector(".container")

loader.parentElement.remove()

const first = bubble(data.map(it => it.timeInt))[0]
const last = bubble(data.map(it => it.timeInt)).reverse()[0]

const table = document.createElement("table")
const thead = document.createElement("thead")
const hRow = document.createElement("tr");
["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"].forEach(it => {
    const cell = document.createElement("th")
    cell.innerText = it
    hRow.appendChild(cell)
})
thead.appendChild(hRow)
table.appendChild(thead)

const tbody = document.createElement("tbody")
console.log(first, last)
for (let t = first; t <= last; t++) {
    const row = document.createElement("tr")
    for (let d = 1; d <= 5; d++) {
        const cell = document.createElement("td")
        const hour = data.find(it => it.dayInt === d && it.timeInt === t)
        if (hour !== undefined) {
            const container = document.createElement("div")
            container.classList.add(hour.typ.toLowerCase());
            [hour.veranstaltungAbbr, hour.typ, hour.room, hours.get(hour.timeInt).join(" - ")].forEach(it => {
                const span = document.createElement("span")
                span.innerText = it
                container.appendChild(span)
            })
            cell.appendChild(container)
        }
        tbody.appendChild(cell)
    }
    tbody.appendChild(row)
}

table.appendChild(tbody)
wrapper.appendChild(table)
