/* FORM SUBMIT */
const form = document.getElementById("itemForm");
if(form){
    form.addEventListener("submit", async function(e){
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try{
            const response = await fetch("/api/items",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(data)
            });

            if(!response.ok) throw new Error("Failed to submit item");
            alert("Report submitted successfully!");
            form.reset();
            window.location.href = "/";
        }catch(error){
            console.error(error);
            alert("Error submitting report");
        }
    });
}

/* LOAD ITEMS */
async function loadItems(){
    const res = await fetch("/api/items");
    const items = await res.json();

    const lostTable = document.getElementById("lostTable");
    const foundTable = document.getElementById("foundTable");

    if(!items) return;

    if(lostTable) lostTable.innerHTML = "";
    if(foundTable) foundTable.innerHTML = "";

    items.forEach(item=>{
        const row = `
        <tr>
            <td>${escapeHTML(item.title)}</td>
            <td>${escapeHTML(item.description)}</td>
            <td>${escapeHTML(item.location)}</td>
            <td>${item.date}</td>
            <td>${item.status}</td>
            <td>
                <button class="action-btn" onclick="updateStatus(${item.id})">Resolve</button>
                <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        </tr>
        `;
        if(item.category === "Lost" && lostTable) lostTable.innerHTML += row;
        if(item.category === "Found" && foundTable) foundTable.innerHTML += row;
    });
}

/* UPDATE STATUS */
async function updateStatus(id){
    await fetch(`/api/items/${id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({status:"Resolved"})
    });
    loadItems();
}

/* DELETE ITEM */
async function deleteItem(id){
    await fetch(`/api/items/${id}`,{method:"DELETE"});
    loadItems();
}

/* XSS PROTECTION */
function escapeHTML(str){
    return str.replace(/[&<>"']/g, function(m){
        return ({
            "&":"&amp;",
            "<":"&lt;",
            ">":"&gt;",
            '"':"&quot;",
            "'":"&#039;"
        })[m];
    });
}

/* AUTO LOAD ITEMS */
document.addEventListener("DOMContentLoaded", loadItems);