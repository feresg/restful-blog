// Bootstrap modals
$('#deleteModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var type = button.data('type') // Extract info from data-* attributes
    var id = button.data('id')
    var determinant = '';
    if (type == 'categorie'){
      determinant = 'cette'
    } else if(type == 'article'){
      determinant = 'cet'
    } else{
      determinant = 'ce';
    }
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-body p').text('Voulez vous vraiment supprimer ' + determinant + ' ' + type +'?')
    modal.find('form').attr('action', '/admin/'+type+'s/'+id+'?_method=delete');
  })
  $('#moreModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var body = button.data('body') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-body p').text(body)
  })
  $('#editCategorieModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var id = button.data('id') // Extract info from data-* attributes
    var categorie = button.data('categorie');
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('form').attr('action', '/admin/categories/'+id+'?_method=put');
    modal.find('input').attr('value', categorie);
  })
  $('#editPartenaireModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var id = button.data('id') // Extract info from data-* attributes
    var partenaire = button.data('partenaire');
    var logo = button.data('logo')
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('form').attr('action', '/admin/partenaires/'+id+'?_method=put');
    modal.find('input[type="text"]').attr('value', partenaire);
    modal.find('img').attr('src', '/img/uploads/partenaires/'+logo);

  })
  $('#deleteCollapse').on('show.bs.collapse', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    console.log(button.data.toString())
    var id = button.data('id') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('form').attr('action', '/admin/commentaires/'+id+'?_method=delete');
  })
