import AppKit

enum MenuBarGlyph {
    static let image: NSImage = {
        let image = NSImage(size: NSSize(width: 18, height: 18))
        for encoded in [
            "iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAABUklEQVR4nI2UPS9EQRSGn10rotCJykelUohEo/eR+AGbaHwUCqJRIrZRUBPxQyhER0P8C40QOgV2lytH3knOjtlr3uRmZu6ZefLOmTkD+ap0+b8FvFcyARXgG1gB6sAAcA08AsfAdg6kqv4pUCS+DQvWMkAFcAJsAi0Hbmv9ENBTBqlpwq5gH5GTttpbHD21FdMXcK5c9GkcVChvb/+5Mc0Bw8AE8Bw5aamtx05Mg8Co+muaOK/xlIN9qm0oVvUODLYIvGqCbWNZ8X6148CTIHv615HoMDh0ydyPILPACDAJrKcgwdaR23sTeABmFFtVbCGxrkNLmth0p1FoGw13q0Maut6bK+UknISHFcCOg5TqLjraInL4Aoy5uvujYPMSmBYoyBz1AmfAvVW4oKWFboWXKkgr1GzZe2K5MdgBcANcuDtkpxPuWanMssFSynmvfvUDVQxmoAfBZ04AAAAASUVORK5CYII=",
            "iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAC70lEQVR4nLWYy2sUQRCHv9kkIvGBSEDw6j8giGKMhiCIFxEEEQRF8O7Ri+7NU27eBCUnUYIXRQIiCnpQBPGB3lRQ8SCoGF9oSDaZkU5+BUWzk53XFjQz0z3d83VVdVX3QH8lAQa7lFAfZEjX/cBP4Hk/YQZ6tK/RdRyYBTJg3kiblETX8IEtwEFgOzAsLTwF7gF/gAlgBlgH/AaO9AMm0f154JvA4vIeuCDATHBBU41Ky5Vp9/FOVBYjuC/SlPep2pIIJFxv6EMLQJqjoSVgTu1Bk96nGoNpRTDdQGKocH0LrI/MXQuGLprJChYz3+HlUVZCQi1pAWuB6xVgzL+C2SYNqFUTJgW2Acc1eBWnDNrd7AetKqn6vwGuCCZAlZWgqb80IC1FY4vIUzV86GRdH2rlPE+VXGWhfJfJCq2yJEqGfhajwH3gmNqHSkClMm+4P10w9+XCoTBvYf/Jcs1KWxHzeZh2URjTyFatIIvCQfYpEWZS9+4oUq8G5WHOuYn0FBv0gTrf0vOYg/khs8U+lQe1VBXGXgwDt91KeKhEmMlcozmDtlQX+1RaFcbPcLKL2j/2gOn2fEkaPVsH5mKUBC17BzOi9zyAfWQncMetPhtvJAe6FEwnJ0PPyCTmzAazx21HnznwpEpm6AWTRfW3BWX9RmUWc/gxB2wTLg1zpmCkXXCaCrLLwfxSaCitESLyEa0eC+lFtg6ZfOqz7kNI2Fs3L1nHU1HCK1I8+KcmYLxKd7jBy/TvqM874JHMv9QE0HDFPe2QtBpOn1fr7o09kC3XspK6qHwCOKq6wbpAjyvMblFjXAMuA6+BVw60khjEBvlB7KxZj6UfThuNix3S2prZ3CpQaQRjwc9iWe2zldl/wmVzv+ftRMXapt0B0Z/PGpFxHfhtaxF+BHzI0dBXt4Vo5LTpJdFyvQls1HHkkPY+wacOKC1sAv4BL4G7gvK/XRqVeQ06636J9Dr4DzQN4eWFEmLQVBDzqV6/4/oi/wGkHmYa4yc+3gAAAABJRU5ErkJggg=="
        ] {
            let representation = NSBitmapImageRep(data: Data(base64Encoded: encoded)!)!
            representation.size = image.size
            image.addRepresentation(representation)
        }
        image.isTemplate = true
        return image
    }()
}
