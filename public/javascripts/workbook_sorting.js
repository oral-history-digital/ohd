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
            $('cancel_sorting').show();
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


/* code for Expansion/Minimization usability */

var togglingContent = 0;
var contentItems = new Array();

function setItemStatus(el, open) {
    if(open) {
        el.addClassName('open');
        el.removeClassName('closed');
    } else {
        el.removeClassName('open');
        el.addClassName('closed');
    }
}

function toggleUserContent(event) {
    if(togglingContent > 0) { return; };
    var el = Element.up(Event.element(event), '.item');
    var details = el.down('.details');
    if(el.hasClassName('closed')) {
        // open
        expandContent(details,true);
    } else {
        // close
        minimizeContent(details,true);
    }
}

function expandAllContents() {
    if(togglingContent > 0) { return; };
    var closedContents = new Array();
    contentItems.each(function(el){
        if(el.parentNode.hasClassName('closed')) {
            closedContents[closedContents.length] = el;
        }
    });
    if(closedContents.length > 0) {
        Effect.multiple(closedContents, Effect.BlindDown, { duration: 0.5, beforeStart: function(){ closedContents.each(function(el){setItemStatus(el.parentNode, true);}); togglingContent = 1;}, afterFinish: function(){ togglingContent = 0; $('expand_all').hide(); $('minimize_all').show();}});
        new Effect.Fade('expand_all', { duration: 0.5 });
    } else {
        $('expand_all').hide();
        $('minimize_all').show();
    }
}

function minimizeAllContents() {
    if(togglingContent > 0) { return; };
    var openContents = new Array();
    contentItems.each(function(el){
        if(!el.parentNode.hasClassName('closed')) {
            openContents[openContents.length] = el;
        }
    });
    if(openContents.length > 0) {
        Effect.multiple(openContents, Effect.BlindUp, { duration: 0.5, beforeStart: function(){ togglingContent = 1;}, afterFinish: function(){ openContents.each(function(el){setItemStatus(el.parentNode, false);}); togglingContent = 0; $('minimize_all').hide(); $('expand_all').show();}});
        new Effect.Fade('minimize_all', { duration: 0.5 });
    } else {
        $('minimize_all').hide();
        $('expand_all').show();
    }
}

function expandContent(el,reset) {
    if(reset) {
        new Effect.BlindDown(el, { duration: 0.5, beforeStart: function(){setItemStatus(el.parentNode, true); togglingContent = 1;}, afterFinish: function(){ togglingContent = 0; }});
    } else {
        new Effect.BlindDown(el, { duration: 0.5, beforeStart: function(){setItemStatus(el.parentNode, true); togglingContent = 0;}});
    }
}

function minimizeContent(el, reset) {
    if(reset) {
        new Effect.BlindUp(el, { duration: 0.5, beforeStart: function(){togglingContent = 1;}, afterFinish: function(){setItemStatus(el.parentNode, false); togglingContent = 0; }});
    } else {
        new Effect.BlindUp(el, { duration: 0.5, afterFinish: function(){setItemStatus(el.parentNode, false); togglingContent = 0;}});
    }
}

function closeOpenActions() {
    $$('.actions.open').each(function(el){
        setItemStatus(el, false);
    });
}