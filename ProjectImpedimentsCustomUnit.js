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

        var rels = ['Generals'];

        var model = rels.map(function(v) {
            return 'impediments' + v + ':' + v +
                '.Where(MasterRelations.Count(RelationType.Name=="Blocker")>0).Select(MasterRelations.Count(RelationType.Name=="Blocker"))';
        }).join(', ');

        var template = rels.map(function(v) {
            return '_.reduce(this.data.impediments' + v + ', function(res, v) {return res + v;}, 0)';
        }).join(' + ');

        template = '<%= ' + template + ' %>';

        template = [
            '<div class="tau-board-unit__value tau-entity-icon tau-entity-icon--impediment">',
                template,
            '</div>'
        ];

        var units = [{
            id: 'project_impediments',
            name: 'Impediments',
            classId: 'tau-board-unit_type_impediments-counter',
            template: template,
            types: [
                types.PROJECT
            ],
            sizes: [sizes.XS, sizes.S, sizes.M, sizes.L, sizes.XL, sizes.LIST],
            sampleData: {
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
