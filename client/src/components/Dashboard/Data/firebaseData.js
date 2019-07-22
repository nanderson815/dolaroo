import Util from '../../Util/Util';

let db = Util.getFirestoreDB()

console.log("I ran homie");

// Change to be unique to company.
let company = "testCompany"



let Data ={
    deposits: [],
    depositsArchive: [],
    cash: [],
    credit: []
}



// Get all deposits from this company only on load
db.collectionGroup("deposits").where("company", "==", company).onSnapshot((querySnapshot) => {
    Data.deposits = [];
    querySnapshot.forEach(doc => {
        let deposit = {};
        deposit = doc.data();
        deposit.id = doc.id;
        deposit.time = deposit.time.toDate();
        Data.deposits.push(deposit);
    });
}, (err) => console.log(err));

// Get all archived deposits on load
db.collectionGroup("depositsarchive").where("company", "==", company).onSnapshot((querySnapshot) => {
    Data.depositsArchive = [];
    querySnapshot.forEach(doc => {
        let deposit = {};
        deposit = doc.data();
        deposit.id = doc.id;
        deposit.time = deposit.time.toDate();
        Data.depositsArchive.push(deposit);
    });
}, (err) => console.log(err));


// Get balances over time
db.collectionGroup("cash").where("company", "==", company).onSnapshot((querySnapshot) => {
    Data.cash = [];
    querySnapshot.forEach(doc => {
        let total = {};
        total = doc.data();
        total.id = doc.id;
        // total.time ? total.time = total.time.toDate() : null;
        total.time  = total.time.toDate() 
        Data.cash.push(total);
    });
}, (err) => console.log(err));

// Get credit over time
db.collectionGroup("credit").where("company", "==", company).onSnapshot((querySnapshot) => {
    Data.credit = [];
    querySnapshot.forEach(doc => {
        let total = {};
        total = doc.data();
        total.id = doc.id;
        total.time = total.time.toDate();
        Data.credit.push(total);
    });
}, (err) => console.log(err));

export default Data;