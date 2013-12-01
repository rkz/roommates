/**
 * Roommates javascript program
 */

// Current state (initialized to initial state)
var data = {
    users: [
        { // User 0
            //id: 'cameron',
            name: 'Cameron',
            picture: 'img/user.jpg',
            score: 53
        },
        { // User 1
            //id: 'marie',
            name: 'Marie',
            picture: 'img/marie.jpg',
            score: 21
        }
    ],

    currentUser: 0,

    tasks: [
        {
            text: 'Bathroom cleanup',
            value: 20,
            assignee: 0,
            dueDate: 'in 2 days'
        },
        {
            text: 'Make sandwiches',
            value: 10,
            assignee: 1,
            dueDate: 'in 3 days'
        },
        {
            text: 'Buy a new tool set',
            value: 40,
            assignee: 1,
            dueDate: 'in 4 days'
        }
    ]
};

// (re)build UI from global data array
function buildUI ()
{
    console.log('Building UI');

    // Build planning page
    buildPlanning();

    // Build leaderboard page
    buildLeaderboard();

    // Build profile page

}

function buildPlanning ()
{
    console.log('building planning page');

    var tpl = _.template($('#tpl-task').text());
    $('#planning .list .task').remove();

    for (i in data.tasks) {
        console.log('rendering task ' + i);
        var task = data.tasks[i];

        // task markup
        $('#planning .list').append(tpl({
            taskId: i,
            text: task.text,
            assignee: data.users[task.assignee].name,
            due: task.dueDate
        }));

        // task actions
        setupTaskCallbacks(i);
    }
}

function setupTaskCallbacks (i)
{
    $('#task-' + i + ' .skip').click(function () { console.log('click skip ' + i); doOrSkipTask(i, true); });
    $('#task-' + i + ' .done').click(function () { console.log('click done ' + i); doOrSkipTask(i); });
}

function buildLeaderboard ()
{
    console.log('building leaderboard page');

    var tpl = _.template($('#tpl-rank').text());
    $('#leaderboard .list .rank').remove();

    for (i in data.users) {
        console.log('rendering user ' + i + ' in leaderboard');
        var user = data.users[i];

        // user markup
        $('#leaderboard .list').append(tpl({
            userId: i,
            picture: user.picture,
            name: user.name,
            title: '',
            score: user.score
        }));
    }
}

// Do or skip a task, and rebuild UI
function doOrSkipTask (id, skip)
{
    console.log('task ' + id + ' ' + (skip ? 'skipped' : 'done'));
    var task = data.tasks[id];
    $('#task-'+id).fadeOut(function () {
        data.users[task.assignee].score += skip ? -task.value : task.value;
        data.tasks.splice(id, 1);
        buildUI();
    });
}

// Initialization
$(document).ready(function () {
    buildUI();
});
