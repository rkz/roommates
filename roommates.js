/**
 * Roommates javascript program
 */

// Current state (initialized to initial state)
var data = {
    users: [
        { // User 0
            //id: 'cameron',
            name: 'Cameron',
            picture: 'img/user.jpg'
        },
        { // User 1
            //id: 'marie',
            name: 'Marie',
            picture: 'img/marie.jpg'
        }
    ],

    currentUser: 0,

    tasks: [
        {
            text: 'Bathroom cleanup',
            value: 20,
            assignee: 0,
            dueDate: new Date(2013, 12, 02)
        },
        {
            text: 'Make sandwiches',
            value: 10,
            assignee: 1,
            dueDate: new Date(2013, 12, 01)
        }
    ]
};

// (re)build UI from global data array
function buildUI ()
{
    console.log('Building UI');

    // Build planning page

    // Build leaderboard page

    // Build profile page

}

// Initialization
$(document).ready(buildUI);
