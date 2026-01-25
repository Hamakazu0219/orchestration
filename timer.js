class TimerApp {
    constructor() {
        // Elements
        this.timeDisplay = document.getElementById('timeDisplay');
        this.timerStatus = document.getElementById('timerStatus');
        this.startPauseBtn = document.getElementById('startPauseBtn');
        this.startBtnText = document.getElementById('startBtnText');
        this.playIcon = document.getElementById('playIcon');
        this.resetBtn = document.getElementById('resetBtn');
        this.progressRing = document.getElementById('progressLink');
        this.presetChips = document.querySelectorAll('.preset-chip');
        this.audio = document.getElementById('timerSound');

        // State
        this.initialTime = 300; // 5 minutes default (seconds)
        this.timeLeft = this.initialTime;
        this.timerId = null;
        this.isRunning = false;

        // Visuals (Circle Props)
        this.radius = this.progressRing.r.baseVal.value;
        this.circumference = 2 * Math.PI * this.radius;
        
        // Setup Circle
        this.progressRing.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.progressRing.style.strokeDashoffset = this.circumference;

        this.init();
    }

    init() {
        this.renderTime();
        this.setProgress(100); // Start full

        // Event Listeners
        this.startPauseBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        
        this.presetChips.forEach(chip => {
            chip.addEventListener('click', (e) => this.setPreset(e.target));
        });
    }

    setProgress(percent) {
        const offset = this.circumference - (percent / 100) * this.circumference;
        this.progressRing.style.strokeDashoffset = offset;
    }

    renderTime() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    setPreset(target) {
        if (this.isRunning) this.stopTimer();
        
        // UI Update
        this.presetChips.forEach(c => c.classList.remove('active'));
        target.classList.add('active');

        // Logic Update
        this.initialTime = parseInt(target.dataset.time);
        this.timeLeft = this.initialTime;
        
        this.timerStatus.textContent = 'Ready';
        this.renderTime();
        this.setProgress(100);
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        if (this.timeLeft <= 0) return;

        this.isRunning = true;
        this.updateControlsUI();
        this.timerStatus.textContent = 'Focus';

        this.timerId = setInterval(() => {
            this.timeLeft--;
            this.renderTime();
            
            // Calculate progress
            const progressPercent = (this.timeLeft / this.initialTime) * 100;
            this.setProgress(progressPercent);

            if (this.timeLeft <= 0) {
                this.finishTimer();
            }
        }, 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        clearInterval(this.timerId);
        this.updateControlsUI();
        this.timerStatus.textContent = 'Paused';
    }

    stopTimer() {
        this.isRunning = false;
        clearInterval(this.timerId);
        this.updateControlsUI();
    }

    resetTimer() {
        this.stopTimer();
        this.timeLeft = this.initialTime;
        this.renderTime();
        this.setProgress(100);
        this.timerStatus.textContent = 'Ready';
        
        // Reset Audio
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    finishTimer() {
        this.stopTimer();
        this.timeLeft = 0;
        this.renderTime();
        this.setProgress(0);
        this.timerStatus.textContent = 'Completed';
        
        // Play Sound
        this.audio.play().catch(e => console.log('Audio playback failed', e));
    }

    updateControlsUI() {
        if (this.isRunning) {
            this.startBtnText.textContent = 'Pause';
            this.playIcon.classList.remove('fa-play');
            this.playIcon.classList.add('fa-pause');
            this.startPauseBtn.classList.remove('primary'); // Optional style change
        } else {
            this.startBtnText.textContent = 'Start';
            this.playIcon.classList.remove('fa-pause');
            this.playIcon.classList.add('fa-play');
            this.startPauseBtn.classList.add('primary');
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const timer = new TimerApp();
});
