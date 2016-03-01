+function() {
"use strict"

/*
* List of selects to sort
*/

var selects = [
    '#values_assigned_to_id_1',
    '#values_author_id_1',
    '#values_watcher_id_1',
    '#issue_assigned_to_id'
];


/*
* Templates!
*/
class HTMLHelper {
    createOptionElement(name, id){
        return $("<option>", {
               text: name,
               value: id
        });
    }

    createOptgroupElement(name, id){
        return $("<optgroup>", {
            label: name,
            id: 'group_' + name.replace(/[^w]/i,'_')
        });
    }
}


/*
* A User in Redmine
*/
class User {
  constructor(id, name, company) {
    this.id = id;
    this.company = company;
    this.name = name;
  }
}

/*
* A container for Users in Redmine
*/
class Users {
    constructor() {
        this.users = [];
        return this;
    }

    add(id, name, company) {
        if(typeof this.users[company] == 'undefined') {
            this.users[company] = [];
        }
        this.users[company].push(new User(id, name, company));
    }

    getUsers(company) {
        if(typeof company == 'undefined') {
            return this.users;
        } else {
            return this.users[company];
        }
    }
}

/*
* A class that does all the stuff necessary to sort the selects
*/
class SelectElementSorter {

    constructor(selectElementId) {
        this.selectElementId = selectElementId;
        this.users = new Users();
        this.externalEmployeeRegEx = new RegExp("^(.*) - (.*)");
        this.htmlHelper = new HTMLHelper();
    }

    backupCurrentValue() {
        this.currentValue = $(this.selectElementId).val();
    }

    restoreCurrentValue() {
        $(this.selectElementId).val(this.currentValue);
    }

    backupUsers() {
        var that = this;

        $(this.selectElementId+" option").each(function(object) {

            var employee = {
                id: $(this).val(),
                name: $(this).text()
            };

            if(employee.id) {
                var match = employee.name.match(that.externalEmployeeRegEx);
                if(match) {
                    that.users.add(employee.id, match[2], match[1]);
                }else {
                    that.users.add(employee.id, employee.name, 'BerlinOnline');
                }
            }
        });
    }

    createOptgroups() {
        var optgroups = [];

        // Iterarte through Companies
        for(var company in this.users.getUsers()) {
            var optgroup = this.htmlHelper.createOptgroupElement(company);

            // Iterate through Users
            for(var i in this.users.getUsers(company)) {
                var user = this.users.getUsers(company)[i];
                $(optgroup).append(
                    this.htmlHelper.createOptionElement(
                        user.name,
                        user.id
                    )
                );
            }
            optgroups.push(optgroup);
        }
        return optgroups;
    }

    run() {
        this.backupCurrentValue();
        this.backupUsers();

        $(this.selectElementId).empty();

        var optgroups = this.createOptgroups();
        for(var i in optgroups) {
            $(this.selectElementId).append(optgroups[i]);
        }
        this.restoreCurrentValue();
    }
}


for (var i in selects) {
    var s = new SelectElementSorter(selects[i]);
    s.run();
}
}();
