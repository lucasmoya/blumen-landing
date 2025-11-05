document.addEventListener('DOMContentLoaded', function() {
    const guestSummary = document.getElementById('guestSummary');
    const guestDropdown = document.querySelector('.guest-dropdown');
    
    if (!guestSummary || !guestDropdown) {
        console.error('Guest dropdown elements not found');
        return;
    }
    
    const applyBtn = document.querySelector('.apply-btn');
    const counterBtns = document.querySelectorAll('.counter-btn');
    
    // Initial counts
    let counts = {
        adults: 2,
        children: 0,
        babies: 0
    };
    
    // Min and max values
    const limits = {
        adults: { min: 1, max: 10 },
        children: { min: 0, max: 6 },
        babies: { min: 0, max: 4 }
    };
    
    // Update the summary text
    function updateSummary() {
        let summary = '';
        let total = counts.adults + counts.children + counts.babies;
        
        if (total === 1) {
            summary = '1 Huésped';
        } else {
            summary = `${total} Huéspedes`;
        }
        
        if (counts.children > 0 || counts.babies > 0) {
            let details = [];
            if (counts.adults > 0) details.push(`${counts.adults} ${counts.adults === 1 ? 'adulto' : 'adultos'}`);
            if (counts.children > 0) details.push(`${counts.children} ${counts.children === 1 ? 'niño' : 'niños'}`);
            if (counts.babies > 0) details.push(`${counts.babies} ${counts.babies === 1 ? 'bebé' : 'bebés'}`);
            summary += ` (${details.join(', ')})`;
        }
        
        guestSummary.value = summary;
    }
    
    // Update button states
    function updateButtons() {
        counterBtns.forEach(btn => {
            const type = btn.dataset.type;
            const action = btn.classList.contains('minus') ? 'minus' : 'plus';
            
            if (action === 'minus' && counts[type] <= limits[type].min) {
                btn.classList.add('disabled');
            } else if (action === 'plus' && counts[type] >= limits[type].max) {
                btn.classList.add('disabled');
            } else {
                btn.classList.remove('disabled');
            }
        });
    }
    
    // Toggle dropdown
    guestSummary.addEventListener('click', function(e) {
        e.stopPropagation();
        guestDropdown.classList.toggle('active');
    });

    // Hacer que el icono de usuarios también abra el dropdown
    const guestIcon = guestSummary.parentElement.querySelector('.fa-users');
    if (guestIcon) {
        guestIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            guestDropdown.classList.toggle('active');
        });
        guestIcon.style.cursor = 'pointer';
    }
    
    // Handle counter buttons
    counterBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent dropdown from closing
            const type = this.dataset.type;
            const action = this.classList.contains('minus') ? 'minus' : 'plus';
            
            if (action === 'minus' && counts[type] > limits[type].min) {
                counts[type]--;
            } else if (action === 'plus' && counts[type] < limits[type].max) {
                counts[type]++;
            }
            
            // Update the count display
            document.getElementById(`${type}Count`).textContent = counts[type];
            
            // Update buttons state
            updateButtons();
            
            // Update summary immediately
            updateSummary();
        });
    });
    
    // Apply button
    if (applyBtn) {
        applyBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent dropdown from closing
            updateSummary();
            guestDropdown.classList.remove('active');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (guestSummary && !guestSummary.contains(e.target) && 
            guestDropdown && !guestDropdown.contains(e.target)) {
            guestDropdown.classList.remove('active');
        }
    });
    
    // Initialize
    updateSummary();
    updateButtons();
});