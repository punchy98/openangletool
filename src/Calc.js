class Calc {

    constructor() {
        this.solved = false;
    }

    parseFloatOrZero(value) {
        return value === '' ? 0.0 : Number.parseFloat(value);
    }

    set(p) {
        this.dw = this.parseFloatOrZero(p.dw);
        this.lp = this.parseFloatOrZero(p.lp);
        this.beta = this.rad(this.parseFloatOrZero(p.beta));
        this.ds = this.parseFloatOrZero(p.ds);
        this.dj = this.parseFloatOrZero(p.dj);
        this.o = this.parseFloatOrZero(p.o);
        this.hc = this.parseFloatOrZero(p.hc);
        this.flat = p.flat === true || p.flat === 'true';
        this.betaCal = this.rad(this.parseFloatOrZero(p.betaCal));
        this.dCal = this.parseFloatOrZero(p.dCal);

        this.solve();
    }

    rad(d) {
        return d / 180 * Math.PI;
    }

    deg(r) {
        return r * 180 / Math.PI;
    }

    solve() {
        if (this.flat) {
            this.solveFlat();
            return;
        }

        var a = 45./180.*Math.PI;
        var b = Math.PI;
        var xa = this.x(a);
        var xb = this.x(b);
        const eps = 1e-5;

        console.log('solve: a='+a+', b='+b+', xa='+xa+', xb='+xb);

	this.solved = false;
        while ((Math.sign(xa) !== Math.sign(xb)) && (b - a) > eps) {
            var m = 0.5 * (a + b);
            var xm = this.x(m);
            if (Math.sign(xa) === Math.sign(xm)) {
                a = m;
                xa = xm;
            } else {
                b = m;
                xb = xm;
            }
	    this.solved = true;
        }

        if (!this.solved) {
	   return;
	}

        this.alpha = 0.5 * (a + b);

        this.h = 0.5 * (
            this.ds * Math.cos(this.alpha + this.beta)
            - 2 * this.lp * Math.cos(this.alpha + this.beta)
            + this.dw * Math.sin(this.alpha)
            - this.dj * Math.sin(this.alpha + this.beta)
            - this.ds * Math.sin(this.alpha + this.beta)
        );

        this.hr = Math.sqrt(this.o * this.o + this.h * this.h)
            + 0.5 * this.ds
            - 0.5 * this.dw;

        this.hn = this.h
            + 0.5 * this.ds
            - this.hc;
    }

    solveFlat() {
        // Flat grinding surface with a tool rest / support bar that extends on
        // rails (e.g. the platen of a 1x30 belt sander).
        //
        // Unlike the round-wheel case, the measured quantity here is the TOTAL
        // bar extension read off the machine, not the perpendicular gap to the
        // platen. Empirically (and after accounting for the tilted platen, the
        // bar/jig diameters, and the measurement reference) this collapses to a
        // simple, well-behaved relationship:
        //
        //   D(beta) = lp * sin(beta) + C
        //
        // where C is a per-machine offset that bundles together everything that
        // does not depend on the grind angle (platen tilt, where the bar
        // measurement is zeroed, bar/jig radii, finger-rest position, ...).
        //
        // C is recovered from a single real calibration measurement: a grind
        // angle betaCal that was actually achieved at a measured bar distance
        // dCal (at this same projection lp):
        //
        //   C = dCal - lp * sin(betaCal)
        //
        // If no calibration is supplied (dCal == 0) we fall back to C = 0, i.e.
        // the raw lp * sin(beta) ideal, which is only a rough starting point.
        var c = this.dCal > 0
            ? this.dCal - this.lp * Math.sin(this.betaCal)
            : 0.0;

        this.alpha = null;
        this.h = null;
        this.hn = null;
        this.hr = this.lp * Math.sin(this.beta) + c;
        this.solved = Number.isFinite(this.hr) && this.hr > 0;
    }

    x(alpha) {
        return -this.o
            + 0.5 * this.dw * Math.cos(alpha)
            - 0.5 * (this.dj + this.ds) * Math.cos(alpha + this.beta)
            + (-0.5 * this.ds + this.lp) * Math.sin(alpha + this.beta);
    }

    get() {
        if (this.solved) {
	   return {
	       alpha: this.alpha === null ? '-' : this.deg(this.alpha).toFixed(1).toString(),
	       h: this.h === null ? '-' : this.h.toFixed(1).toString(),
	       hr: this.hr.toFixed(1).toString(),
	       hn: this.hn === null ? '-' : this.hn.toFixed(1).toString()
	   };
        }
	return {
	    alpha: '-',
	    h: '-',
	    hr: '-',
	    hn: '-'
	};
    }

}

export default Calc;
