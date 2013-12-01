/**
 * Roommates javascript program
 */

// Current state (initialized to initial state)
var data = {
    users: [
        { // User 0
            //id: 'cameron',
            name: 'Cameron',
            picture: 'cameron.jpg',
            score: 53,
            currentBadge: 0,
            otherBadges: [
                { badgeId: 0, progress: 80 },
                { badgeId: 1, progress: 60 }
            ]
        },
        { // User 1
            //id: 'marie',
            name: 'Marie',
            picture: 'marie.png',
            score: 89,
            currentBadge: 1,
            otherBadges: [
                { badgeId: 0, progress: 40 },
                { badgeId: 1, progress: 60 }
            ]
        },
        { // User 2
            name: 'Michael',
            picture: 'michael.jpg',
            score: 32,
            currentBadge: 2,
            otherBadges: []
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
            text: "Buy Seb's birthday gift",
            value: 10,
            assignee: 0,
            dueDate: 'in 3 days'
        }
    ],

    badges: [
        { // badge 0
            name: 'Cleanup avoider',
            picture: 'dummy.png'
        },
        { // badge 1
            name: 'Starred chef',
            picture: 'dummy.png'
        },
        { // badge 2
            name: 'Shopping angel',
            picture: 'dummy.png'
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
    buildProfile();
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

        // hide action buttons if the assignee is not the current user
        if (task.assignee != data.currentUser) {
            $('#task-' + i + ' .skip').hide();
            $('#task-' + i + ' .done').hide();
        }

        // task actions
        setupTaskCallbacks(i);
    }

    $('#btn-add-task').off().click(showAddTaskForm);
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
            title: data.badges[user.currentBadge].name,
            score: user.score
        }));

        var w = (user.score / data.users[data.currentUser].score) * 50;
        $('#leaderboard #rank-' + i + ' .bar').css('width', w + '%');
    }
}

function buildProfile ()
{
    console.log("building current user's profile");

    var user = data.users[data.currentUser];

    // Profile header
    var tplHeader = _.template($('#tpl-profile-header').text());
    $('#profile .profile-header').remove();
    $('#profile').prepend(tplHeader({
        name: user.name,
        picture: user.picture,
        badge: data.badges[user.currentBadge].name,
        badgePicture: 'dummy.jpg'
    }));

    // Badges
    var tplBadge = _.template($('#tpl-profile-badge').text());
    $('#profile .list .badge').remove();
    for (i in user.otherBadges) {
        var badgeId = user.otherBadges[i].badgeId;
        var badge = data.badges[badgeId];
        $('#profile .list').append(tplBadge({
            badgeId: badgeId,
            badge: badge.name
        }));
        console.log('progress: ' + user.otherBadges[i].progress);
        $('#badge-' + badgeId + ' .bar').css('width', user.otherBadges[i].progress + '%');
    }
}

// Set page (planning, leaderboard or profile)
function slideToPage (pageName)
{
    var targetX;
    switch (pageName) {
        case 'planning': targetX = 0; break;
        case 'leaderboard': targetX = -402; break;
        case 'profile': targetX = -804; break;
    }

    $('#pager').animate({ left: targetX }, 1000);
}

// Do or skip a task, and rebuild UI
function doOrSkipTask (id, skip)
{
    console.log('task ' + id + ' ' + (skip ? 'skipped' : 'done'));
    var task = data.tasks[id];
    var user = data.users[task.assignee];
    var delta = (skip ? (-task.value) : (task.value));

    $('#task-'+id).fadeOut(function () {
        // évolution du score
        user.score += delta;

        // notification
        if (delta > 0)
            notify('Congrats! you just earned ' + delta + ' points.');
        else
            notify('Ooh no... you just lose ' + (-delta) + ' points.');

        // retirer la tâche de la liste
        data.tasks.splice(id, 1);

        // si la tâche est done, faire évoluer les badges
        if (!skip) {
            for (i in user.otherBadges) {
                console.log('increasing badge ' + i);
                user.otherBadges[i].progress = Math.min(100, user.otherBadges[i].progress + 25);
            }
        }

        buildUI();
    });
}

// Add task - step1: show the form
function showAddTaskForm ()
{
    var form = $('#add-task-form');

    // cleanup form
    $('#add-task-assignee option').remove();
    $('#add-task-assignee').append('<option value="">Choose a flatmate...</option>');
    for (i in data.users) {
        var user = data.users[i];
        $('#add-task-assignee').append('<option value="' + i + '">' + user.name + '</option>')
    }
    $('#add-task-details input').val('');

    // slide up
    $('#btn-add-task').hide();
    $('#add-task').animate({ bottom: 0 }, 1000);

    // button callback
    $('#btn-do-add-task').off().click(doAddTask);
}

// Add task - step2: add the task
function doAddTask ()
{
    var task = {
        text: $('#add-task-name').val(),
        value: parseInt($('#add-task-value').val()),
        assignee: parseInt($('#add-task-assignee option:selected').prop('value')),
        dueDate: $('#add-task-due').val()
    };

    console.log(task);

    data.tasks.push(task);

    // reset adding form state
    $('#add-task').animate({ bottom: -200 }, 1000);
    $('#add-task-name').val('');

    buildUI();
}

// Show notification
function notify (html)
{
    $('#notification').html(html);
    $('#notification').slideDown();
    setTimeout(function () { $('#notification').slideUp(); }, 1500);
}


// Initialization
$(document).ready(function () {
    console.log('LOAD');
    buildUI();
    window.slideToPage = slideToPage;
    $('#notification').hide();
});
