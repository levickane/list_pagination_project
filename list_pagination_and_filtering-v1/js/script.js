const studentList = document.querySelector('.student-list');
const formatDate = (date) => {
   const options = {year: '2-digit', month: '2-digit', day: '2-digit'}
   return new Intl.DateTimeFormat('en-US', options).format(date)
}
/* found this from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat */
const removeChildNodes = (parent) => {
   while (parent.firstChild){
      parent.removeChild(parent.firstChild)
   }
}

/* This function shows a page of 10 items and then removes them before showing a new page.
For the item that it creates, we're plugging in the items from the data.js into the <li>
then it appends it to the bottom  of the <ul> */
const showPage = (list, page) =>{
   const lastItem = Math.min((page * 10) - 1, list.length - 1);
   const firstItem = (page - 1) * 10;
   if (firstItem > list.length){
      return
   }
   const listUl = document.querySelector("ul.student-list")
   removeChildNodes(listUl)
   for (let i=firstItem; i<=lastItem; i+=1) {
      const item = list[i]
      const dateJoined = new Date(Date.parse(item.joined))
      const listItem = `
         <li class="student-item cf">
            <div class="student-details">
               <img class="avatar" src="${item.img}">
               <h3>${item.name}</h3>
               <span class="email">${item.email}</span>
            </div>
            <div class="joined-details">
             <span class="date">Joined ${formatDate(dateJoined)}</span>
            </div>
  </li>`
      listUl.insertAdjacentHTML("beforeend",listItem)
   }
}


/* This function appends the page links. In the event that the search bar is used and no
results are shown, then there will be no page numbers. If the page is active, then the page number
will be highlighted, otherwise it wont be. When you click on one of the page numbers, it will
jump to that page and show that data from that page and then properly highlight the right page number. */
const appendPageLinks = (list, page) => {
   const numPages = list.length === 0 ? 0 :list.length/10 + 1
   const ulRef = document.querySelector("div.pagination ul")
   removeChildNodes(ulRef)
   for (let i = 1; i <= numPages; i += 1){
      const liItem = `
      <li>
         <a class="${page===i ? 'active' : ''}" href="#">${i}</a>
      </li>`
      ulRef.insertAdjacentHTML("beforeend", liItem)
      document.querySelector(`div.pagination ul li:nth-child(${i})`).addEventListener('click', () => {
         showPage(data, i)
         appendPageLinks(data, i)
      })

   }
}

/* this function creates a search bar and inserts it to the end of the div with the class
page-header. It filters the data based on what is entered to the input field. If the input
field is blank, it will show the normal data, otherwise it will filter the data based on
if the data includes whatever is writen into the input field. If no results are shown,
then a message saying "No Results" will appear, otherwise, that block content wont show at all */
const searchBar = () => {
   const sBar = `
   <div class="student-search">
          <input placeholder="Search for students...">
          <button>Search</button>
        </div>`
   document.querySelector('.page-header').insertAdjacentHTML("beforeend", sBar)
   document.querySelector('div.student-search input').addEventListener('input', () => {
      const searchContent = document.querySelector('div.student-search input').value
      filterData = searchContent === '' ? data : data.filter(e => e.name.includes(searchContent))
      document.getElementById('empty_container').style.display = filterData.length === 0 ? 'block' : 'none'
      showPage(filterData, 1)
      appendPageLinks(filterData, 1)
   })
}
let filterData = data
searchBar()
showPage(filterData, 1)
appendPageLinks(filterData, 1)

