/*globals tau*/
tau
    .mashups
    .addDependency('Underscore')
    .addDependency('jQuery')
    .addDependency('tau/configurator')
    .addDependency('tau/models/board.customize.units/const.entity.types.names')
    .addDependency('tau/models/board.customize.units/const.card.sizes')
    .addMashup(function(_, $, globalConfigurator, types, sizes) {
        'use strict';

        var rels = {
            'total': ['Generals'],
            'assignables': ['Features', 'Epics', 'UserStories', 'Tasks', 'Bugs', 'TestPlans', 'Requests', 'TestPlanRuns']
        };

        var modelTotal = rels.total.map(function(v) {
            return 'impediments' + v + ':' + v +
                '.Where(SlaveRelations.Count(RelationType.Name=="Blocker")>0).Select(SlaveRelations.Count(RelationType.Name=="Blocker"))';
        });

        var modelAssignables = rels.assignables.map(function(v) {
            return 'impediments' + v + ':' + v +
                '.Where(EntityState.isFinal == false and SlaveRelations.Count(RelationType.Name=="Blocker")>0).Select(SlaveRelations.Count(RelationType.Name=="Blocker"))';
        });

        var model = modelTotal.concat(modelAssignables).join(', ');

        var templateTotal = rels.total.map(function(v) {
            return '_.reduce(this.data.impediments' + v + ', function(res, v) {return res + v;}, 0)';
        }).join(' + ');

        var templateOpen = rels.assignables.map(function(v) {
            return '_.reduce(this.data.impediments' + v + ', function(res, v) {return res + v;}, 0)';
        }).join(' + ');

        var template;

        template = [
            '<span class="tau-entity-icon tau-entity-icon--impediment" title="Impediment">I</span>',
            '<div class="tau-board-unit__value-open"><%= ' + templateOpen + ' %></div>/',
            '<div class="tau-board-unit__value-total"><%= ' + templateTotal + ' %></div>'
        ];

        var units = [{
            id: 'project_impediments',
            name: 'Open/total impediments',
            classId: 'tau-board-unit_type_impediments-counter',
            template: template,
            types: [
                types.PROJECT
            ],
            sizes: [sizes.XS, sizes.S, sizes.M, sizes.L, sizes.XL, sizes.LIST],
            sampleData: {
                impedimentsTasks: [0, 1],
                impedimentsGenerals: [1, 2]
            },
            model: model
        }];

        function addUnits(configurator) {
            var registry = configurator.getUnitsRegistry();
            _.extend(registry.units, registry.register(units));
        }

        globalConfigurator.getGlobalBus().once('configurator.ready', function(e, configurator) {
            addUnits(configurator);
        });
    });
