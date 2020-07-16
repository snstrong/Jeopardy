// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

NUM_CATEGORIES = 6;
NUM_QUESTIONS_PER_CAT = 5;
let categories = [];

// TODO - get RANDOM categories
//
/** Get NUM_CATEGORIES random categories from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    let res = await axios.get(`http://jservice.io/api/categories?count=${NUM_CATEGORIES}`);
    // console.log(res);
    for (let cat of res.data) {
        categories.push(cat.id)
    }
    // console.log(categories);
    return categories;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    let res = await axios.get(`http://jservice.io/api/category?id=${catId}`);
    let clueArr = [];
    for (let clue of res.data.clues) {
        clueArr.push( { question : encodeURI(clue.question), answer : encodeURI(clue.answer), showing : null } );
    }
    return { title : res.data.title, clues : clueArr };
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function getTableData() {
    let tableData = [];
    for (let id of await getCategoryIds()) {
        let info = await getCategory(id);
        tableData.push(info);
    }
    return tableData;
}

async function fillTableHead(tableData) {
    for (let item of tableData) {
        $('tr').append(`<th>${item.title}</th>`)
    }
}

async function fillTableBody(tableData) {
    // row by row
    // 6 across, 5 down
    // inner loop: categories, outer loop: rows
    for (let x = 0; x < NUM_QUESTIONS_PER_CAT; x++) {
        let $tr = $(`<tr id="row${x}"></tr>`)
        for (let y = 0; y < NUM_CATEGORIES; y++) {
            $tr.append($(`<td id="${x}-${y}" data-category="${tableData[y].title}" data-question="${tableData[y].clues[x].question}" data-answer="${tableData[y].clues[x].answer}" data-showing="${tableData[y].clues[x].showing}">?</td>`));
        }
        $("table").append($tr);
    }
}

async function fillTable() {
    $('h1').after('<table> <thead> <tr id="tableHead"> </tr> </thead> </table>');
    let tableData = await getTableData();
    await fillTableHead(tableData);
    await fillTableBody(tableData);
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

async function handleClick(evt) {
    $e = $(evt.target);
    if ($e.attr("data-showing") === "null") {
        $e.html(decodeURI($e.attr("data-question")));
        $e.attr("data-showing", "question");
    } else if ($e.attr("data-showing") === "question")  {
        $e.html(decodeURI($e.attr("data-answer")));
        $e.attr("data-showing", "answer");
    }
}

// TODO
/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

// TODO
/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    await fillTable();
}

// TODO
/** On click of start / restart button, set up game. */


/** On page load, add event handler for clicking clues */
setupAndStart();
$( document ).ready(function() {
    $("table").on("click", "td", function(evt) {
        // evt.target.innerText = "U CLICKED ME?!"
        // console.log(evt.target.dataset.question);
        // $e = $(evt.target);
        // console.log($e);
        // console.log($e.attr("data-question"));
        // $e.text($e.attr("data-question"));
        handleClick(evt);
    });
})