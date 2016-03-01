+function() {
"use strict"

/*
* List of selects to sort
*/

var selects = [
    '#issue_status_id'
];

var stati = [
    'Neu',
    'Feedback benötigt',
    'Umsetzung',
    'Umsetzung (fertig)',
    'Abnahme',
    'Abnahme (fertig)',
    'Geschlossen'
]

class StatusSelectSorter {
    constructor(id) {
        this.selectId = id;
    }

    run() {
        $(this.selectId+" option").each(function() {
            if( $.inArray( $(this).text(), stati )== - 1) {
                $(this).remove();
            }
        });
    }
}


for (var i in selects) {
    var s = new StatusSelectSorter(selects[i]);
    s.run();
}
}();
