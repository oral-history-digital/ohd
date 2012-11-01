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

function finishSorting(id) {
    finalizeSortLinks();
}

function cancelSorting(id) {
    finalizeSortLinks();
    if(sortItems) {
        sortItems.revert();
        Sortable.destroy($(id));
    }
    $(id).removeClassName('sort');
}