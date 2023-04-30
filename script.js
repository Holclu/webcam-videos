function ChangePageStyle(){
  if (document.querySelector('html').className.includes('dark')){
    document.querySelector('html').classList.remove('dark');
  } else {
    document.querySelector('html').classList.add('dark');
  }
}
