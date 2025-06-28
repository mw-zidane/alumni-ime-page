document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementById('search');
    var filterSelect = document.getElementById('filter');
    var filterValueSelect = document.getElementById('filter-value');
    var cards = document.querySelectorAll('.card');

    function getUniqueValues(type) {
        var values = {};
        var arr = [];
        if (type === 'cohorte') {
            var titles = document.querySelectorAll('.cohorte-title');
            for (var i = 0; i < titles.length; i++) {
                var t = titles[i].textContent.replace(/\s+/g, ' ').trim();
                if (t && !values[t]) { values[t] = true; arr.push(t); }
            }
        } else if (type === 'promo') {
            for (var i = 0; i < cards.length; i++) {
                var val = cards[i].querySelector('.promo');
                if (val) {
                    var v = val.textContent.replace(/\s+/g, ' ').trim();
                    if (v && !values[v]) { values[v] = true; arr.push(v); }
                }
            }
        } else if (type === 'entreprise') {
            for (var i = 0; i < cards.length; i++) {
                var val = cards[i].dataset.entreprise || (cards[i].querySelector('.company') ? cards[i].querySelector('.company').textContent : '');
                val = val.replace(/\s+/g, ' ').trim();
                if (val && !values[val]) { values[val] = true; arr.push(val); }
            }
        } else if (type === 'poste') {
            for (var i = 0; i < cards.length; i++) {
                var val = cards[i].dataset.poste || (cards[i].querySelector('.title') ? cards[i].querySelector('.title').textContent : '');
                val = val.replace(/\s+/g, ' ').trim();
                if (val && !values[val]) { values[val] = true; arr.push(val); }
            }
        }
        arr.sort();
        return arr;
    }

    function populateFilterValues() {
        var selectedFilter = filterSelect.value;
        filterValueSelect.innerHTML = '';
        if (!selectedFilter) {
            filterValueSelect.style.display = 'none';
            return;
        }
        var values = getUniqueValues(selectedFilter);
        filterValueSelect.style.display = '';
        var options = '<option value="">Tous</option>';
        for (var i = 0; i < values.length; i++) {
            options += '<option value="' + values[i].replace(/"/g, '&quot;') + '">' + values[i] + '</option>';
        }
        filterValueSelect.innerHTML = options;
    }

    function getCohorteTitle(card) {
        var parent = card.parentElement;
        while (parent && !parent.classList.contains('cohorte-section')) {
            parent = parent.parentElement;
        }
        if (parent) {
            var title = parent.querySelector('.cohorte-title');
            return title ? title.textContent.replace(/\s+/g, ' ').trim() : '';
        }
        return '';
    }

    function filterCards() {
        var searchTerm = searchInput.value.toLowerCase();
        var selectedFilter = filterSelect.value;
        var selectedValue = filterValueSelect.value;
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var name = card.querySelector('.name') ? card.querySelector('.name').textContent.toLowerCase() : '';
            var promo = card.querySelector('.promo') ? card.querySelector('.promo').textContent.replace(/\s+/g, ' ').trim() : '';
            var entreprise = card.dataset.entreprise ? card.dataset.entreprise.toLowerCase() : (card.querySelector('.company') ? card.querySelector('.company').textContent.toLowerCase() : '');
            var poste = card.dataset.poste ? card.dataset.poste.toLowerCase() : (card.querySelector('.title') ? card.querySelector('.title').textContent.toLowerCase() : '');
            var cohorte = getCohorteTitle(card);
            var isVisible = name.indexOf(searchTerm) !== -1;
            if (selectedFilter && selectedValue) {
                if (selectedFilter === 'promo' && promo !== selectedValue) isVisible = false;
                else if (selectedFilter === 'cohorte' && cohorte !== selectedValue) isVisible = false;
                else if (selectedFilter === 'entreprise' && entreprise !== selectedValue.toLowerCase()) isVisible = false;
                else if (selectedFilter === 'poste' && poste !== selectedValue.toLowerCase()) isVisible = false;
            }
            card.style.display = isVisible ? '' : 'none';
        }
    }

    filterSelect.addEventListener('change', function () {
        populateFilterValues();
        filterCards();
    });
    filterValueSelect.addEventListener('change', filterCards);
    searchInput.addEventListener('input', filterCards);
    populateFilterValues();
});