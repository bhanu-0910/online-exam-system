// Active menu
let links=document.querySelectorAll(".sidebar a");
let current=window.location.pathname.split("/").pop();

links.forEach(l=>{
if(l.getAttribute("href")===current){
l.classList.add("active");
}
});

// Password toggle
function togglePassword(icon,id){
let input=document.getElementById(id);

if(input.type==="password"){
input.type="text";
icon.classList.replace("fa-eye","fa-eye-slash");
}else{
input.type="password";
icon.classList.replace("fa-eye-slash","fa-eye");
}
}