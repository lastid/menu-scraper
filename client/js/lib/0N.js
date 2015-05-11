N = {
    showLoading: function(msg){
        var loadingEl = $('#loading');

        msg = msg || T("Loading...");
        loadingEl.find('div').html(msg);
        loadingEl.show();
    },

    hideLoading: function(){
        $('#loading').hide();
    },

    handleError: function (error) {

        if (error) {
            message = error.reason;
            alert(message);

            return true;
        }

        return false;
    }
};
