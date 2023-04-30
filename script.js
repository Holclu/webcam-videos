function ChangePageStyle(){
  if (document.querySelector('html').className.includes('dark')){
    document.querySelector('html').classList.remove('dark');
  } else {
    document.querySelector('html').classList.add('dark');
  }
}
function getCategories() {
  var loadedcategories = [];
  for (var i = 1; i < videos.length+1; i++) {
    for (var j = 0; j < videos[i-1].category.split(":").length; j++) {
      loadedcategories.push(videos[i-1].category.split(":")[j]);
    }
  }
  loadedcategories = [...new Set(loadedcategories)];
  loadedcategories=loadedcategories.sort(function(a, b) {
    var nameA = a.toUpperCase();
    var nameB = b.toUpperCase();
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB){
      return 1;
    } else {
      return 0;
    }
  });
  return loadedcategories;
}
function loadCategories(){
  document.title="Categories";
  var listItems=document.createElement('div');
  listItems.className='listItems';
  var categories=getCategories();
  for (var i=0; i<categories.length; i++) {
    var category=document.createElement('a');
    category.innerText=categories[i].replaceAll('_',' ');
    category.href="#category=" + categories[i];
    category.onclick=function(){var cat = this.href.substring(this.href.indexOf('#category=')+10); LoadPageVideos(null,cat,document.querySelector('#filModels').value,document.querySelector('#filSearch').value);};//loadCategoryVideos(cat);}
    category.className="video";
    category.style.textAlign="center";
    listItems.appendChild(category);
  }
  document.querySelector('body').appendChild(listItems);
}
