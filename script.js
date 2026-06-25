
async function loadLanguage(lang){
 const data=await fetch(`i18n/${lang}.json`).then(r=>r.json());
 document.querySelectorAll('[data-i18n]').forEach(el=>{
   el.textContent=data[el.dataset.i18n];
 });
 document.documentElement.lang=lang;
 localStorage.setItem('lang',lang);
}
document.getElementById('languageSwitcher').addEventListener('change',e=>loadLanguage(e.target.value));
loadLanguage(localStorage.getItem('lang')||'pt');
