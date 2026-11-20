import AppKit

enum MenuBarGlyph {
    static let image: NSImage = {
        let image = NSImage(size: NSSize(width: 18, height: 18))
        for encoded in [
            "iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAABf0lEQVR4nI2UPUsDQRCGn1uTGD8QSyvTaCWI6B+wtrew0DKo/8dCWy0s7C3tbWy0FOy0E4QQMBdP3mMGJusl+MKyezNzM+987MJfzNl+DHwCu5lcaGXfpMxJEQy2gFVgM+gcJTCe5agCvu08su8yC9QGLoDT6CNl0ZaBXjAowmrbvgacA2fh3yJZKspZuAJegG5gVhizIfBjAcTyy/SSVclyVRrCOrAELAbZyJheAjvAICu2zl052gf2QhErW57uANgG+sCRMYvluAWe5e0BeAU2GrpDkJXGrggpYSR6yaJ70XWehtaUIHXt3NEsB/9B3TVftWCGcTkloDpciO5BaCUNxpXtsu2Ebw+ucelIed9QB58dbBwegRvgDlhgEocaVp+HZB15t30YhrRjjHWJsckfh6sj22HKhH2bGSnnTVYZQzHx5ij4iul1rmvkxoKeDS3B58S76pf4A7gGnqLeHTn8cuqeuS7a+OtwEmR1wKZnxJlo2pXiW8ba05l42H4B7Fhd3LpRqQUAAAAASUVORK5CYII=",
            "iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAC2UlEQVR4nL2YzctNURTGf/vcgyj5KAOFQnoHSqEMlIGEGQMpxcTAn2DAzJSxlH/ARJSPMlAKxcTHq0yEDJQJyUcI9x6t27NrOe45Z59zrvvUbp+7P9Ze+1lr77X2hXbIVJ8APgHzwEYguL6ZIaheCnwACpWLas+nsUjWQaEVwBJgJIVWq71ImG9KD+oGddnVSCWo/EqcZwr/dspN3EBXu4eK77qxy4FjwE4p0zSPKoUHJaddA3xzJruq9kmmiCyaiR85vztYNaeOIRNkiw577CiaZhOwDfih9r2uP0mhKGgdsEc7NMW6Ipe8yEil32U1bVuAp8Bt4I6Oe1szR5QZDm0VMgGHdMSN5h3AVvUPWpg5FdHXan1ogYRmWmRBglAbvxnY7+Y3IRIwXitzFOc1NGcJwody1sfALeCyYzM0MLoQWGnfcfdDXVptaC7D5h6RcHPaA8D6BoVs3e3AM+AlcDKT814CLgCreiqFM3Mh5epgZJwG5uSvZ3NdbBs0IFck74Pg6pTNLXPhaJCL1p/albE1a4wcoyGX7+RqjMFvlgj+R9YyUP53zDzLa0L5ful7wnojZnDxqp9KGtoSRZmhd7rmTbEXzB6ZCx0jY+QwcAb4ApxysasvUs3/XYdpnCGYQg+AfW5A3kOhoHqoBUYJ488pm7BYdj7eP7GzDzMBuA4cV8i4B7xpYMvWv6sMwW7sV01sFA0CPQYKQ7uAtcANl7IWDXHvvUpWd6riU2eYECSjcBt/37Wl+KN/Uo3Tj0kDDDcV4xYrNXhS6q9SalJulbKZsdy8RuOHcrY52fmjm1wH/xgoJ3yTvv9C3kD/vAruAu2KoOBtchZ1iWXR4SL9XcJK3JiZ/LXMnzk/+0dmU6gYOZ8JPRT6DOwGjgLPgWvuwHRGVvGUvpL4PEpCl2CauW//GiXB/DFuDaehUKHaYp45Z9z1V9VNLHjzTw2RHQvGptRbvWin9pfeH3TnsfU8dGBAAAAAAElFTkSuQmCC"
        ] {
            let representation = NSBitmapImageRep(data: Data(base64Encoded: encoded)!)!
            representation.size = image.size
            image.addRepresentation(representation)
        }
        image.isTemplate = true
        return image
    }()
}
