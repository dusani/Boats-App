$(document).ready(() => {
    $('.delete-boat').on('click', event => {
        $target = $(event.target);
        // console.log($target.attr('data-id'));
        const id = $target.attr('data-id');

        $.ajax({
            type: 'DELETE',
            url: '/boat/' + id,
            success: response => {
                alert('Deleting Boat');
                window.location.href = '/';
            },
            error: error => {
                console.log(error);
            }
        });
    });
});
