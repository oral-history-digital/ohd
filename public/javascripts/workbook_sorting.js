var sortItems = null;
var itemOrder = [];
var sortingActive = false;

function activateSorting(id) {
    var sortItems = $(id);
    sortItems.addClassName('sort');
    $('activate_sorting').parentNode.addClassName('active');
    Sortable.create(id, {
        tag: 'div',
        elements: $$('#' + id + ' .item'),
        handles: $$('#' + id + ' .handle'),
        onChange: updateOrder
    } );
    itemOrder = Sortable.sequence(sortItems);
}

function updateOrder(item) {
    if(!sortingActive) {
        $('finalize_sorting').show();
        $('cancel_sorting').show();
        sortingActive = true;
    }
    $(item).down('.handle').addClassName('changed');
    //var items = Sortable.sequence(item);
    // new Effect.Highlight(item);
    //alert('Cu: ' + items);
}

function finalizeSortLinks() {
    $('activate_sorting').parentNode.removeClassName('active');
    if(Sortable.sequence(sortItems) == itemOrder) {
      $('cancel_sorting').hide();
      $('finalize_sorting').hide();
      sortingActive = false;
    }
}

function updateChanges(id) {
    // iterate over elements and change numeration,
    // and remove the changed class
    var index = 0;
    $$('#' + id + ' .item').each(function(el){
        index++;
        var handle = el.down('.handle');
        handle.down('a').innerHTML = '' + index + '.';
        handle.removeClassName('changed');
    });
}

function cleanUp(id) {
    $(id).removeClassName('sort');
    Sortable.destroy($(id));
}

function finalizeSorting(id) {
    new Ajax.Request('/' + id + '/sort',{ 
        parameters: (Sortable.serialize($(id)) + '&authenticity_token=' + authenticityToken),
        onLoading: function() { new Effect.Appear('overlay'); },
        onSuccess: function() { updateChanges(id); finalizeSortLinks(); cleanUp(id); new Effect.Fade('overlay'); }
    });
    // TODO: the onSuccess stuff is working up until cleanUp(id) which is not
    // - make a parametrized prototype and handle this cleanly (not by passing a local var)
}

function cancelSorting(id) {
    finalizeSortLinks();
    cleanUp(id);
}