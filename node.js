const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let names = new Set()
function scrape(file, contestI) {
    const html = fs.readFileSync(file).toString();
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const problems = doc.querySelector(".standings tr").children.length - 4
    const table = doc.querySelector(".standings tbody").children
    console.log(table.length);
    const people = []
    for (let i = 1; i < table.length; i++) {
        let n = table[i].children[1].children
        for (let i = 0; i < n.length; i++) {
            if (n[i].tagName === 'A') {
                n = n[i]
                break
            }
        }
        const rank = Number(table[i].children[0].textContent);
        const solved = Number(table[i].children[2].textContent);
        if (rank > 0) {
            // if (contestI > 1) {
                names.add(n.textContent)
            // }
            const person = {
                rank,
                name: n.textContent,
                solved
            }
            people.push(person)
        }
    }
    return { problems, people }
}

let result = [];
for (let i = 1; i <= 12; i++) {
    let con = scrape(`txt/contest#${i}.txt`, i)
    con.contest = i
    result.push(con)
}
function findKid(name) {
    const r = []
    const s = []
    result.forEach(contest => {
        const found = contest.people.find(p => p.name == name)
        r.push(found ? found.rank : -1)
        s.push(found ? (found.solved * 100) / contest.problems: '0')
    })
    return { r, n: name, s }
}
const kids = []
names.forEach(name => {
    kids.push(findKid(name))
})
var g47 = ['epix','p4ndish','super3codes','nabroleonx','Simon_Ghiwot','ebdollasign','J0RdN','mafilala','yonaries','kenenisa','abudah29','Bura_B','ahmedin','se348']
result = result.map(e=>{
    e.people = e.people.filter(val=>g47.find(b=>b==val.name))
    return e
}).map(e=>{
    e.people = e.people.sort((a,b)=>a.rank-b.rank).map((val,i)=>{
        val.rank = i+1
        return val
    })
    return e
})
const g47Members = []
g47.forEach(name=>{
    g47Members.push(findKid(name))
})
fs.writeFileSync("result.json", JSON.stringify({ raw: result, kids,g47Members }))
console.log(result);