var ContentSorting = Class.create();
ContentSorting.prototype = {
    initialize: function(id, auth_token) {
        this.dom_id = id;
        this.auth_token = auth_token;
        this.sortItems = $(id);
        this.sortingActive = false;
        this.itemOrder = [];
        window._sorting = this;
        return this;
    },

    activateSorting: function() {
        this.sortItems.addClassName('sort');
        $('activate_sorting').parentNode.addClassName('active');
        $('cancel_sorting').show();
        Sortable.create(this.dom_id, {
            tag: 'div',
            elements: $$('#' + this.dom_id + ' .item'),
            handles: $$('#' + this.dom_id + ' .handle'),
            onChange: window._sorting.updateOrder
        } );
        this.itemOrder = Sortable.sequence(this.sortItems);
    },

    updateOrder: function(item) {
        if(!this.sortingActive) {
            $('finalize_sorting').show();
            this.sortingActive = true;
        }
        $(item).down('.handle').addClassName('changed');
    },

    finalizeSortLinks: function() {
        $('activate_sorting').parentNode.removeClassName('active');
        if(Sortable.sequence(this.sortItems) == this.itemOrder) {
          $('cancel_sorting').hide();
          $('finalize_sorting').hide();
          this.sortingActive = false;
        }
    },

    updateChanges: function() {
        var index = 0;
        $$('#' + this.dom_id + ' .item').each(function(el){
            index++;
            var handle = el.down('.handle');
            handle.down('a').innerHTML = '' + index + '.';
            handle.removeClassName('changed');
        });
    },

    cleanUp: function() {
        this.sortItems.removeClassName('sort');
        Sortable.destroy(this.sortItems);
        this.sortingActive = false;
    },

    finalizeSorting: function() {
        new Ajax.Request('/' + this.dom_id + '/sort',{
            parameters: (Sortable.serialize(this.sortItems) + '&authenticity_token=' + this.auth_token),
            onLoading: function() { new Effect.Appear('overlay'); },
            onSuccess: function() { window._sorting.updateChanges(); window._sorting.finalizeSortLinks(); window._sorting.cleanUp(); new Effect.Fade('overlay'); }
        });
    },

    cancelSorting: function() {
        this.finalizeSortLinks();
        this.cleanUp();
    }
};