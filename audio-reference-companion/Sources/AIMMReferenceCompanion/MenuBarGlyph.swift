import AppKit

enum MenuBarGlyph {
    static let image: NSImage = {
        let image = NSImage(size: NSSize(width: 18, height: 18))
        for encoded in [
            "iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAABc0lEQVR42qXUMWsVQRAH8N/d2zyjwXRaKkHURixE/QC2gq2NqAipzMexEmwEOwsrO1uxVsFOsRGsVKIJyXve2czCsLmXxoHlbmdmZ+b/n9nlqMziex/fcTX2ffIpye+IEbrkcA1ncWnCd4m/xwUacRj/i9gvm0RzPMHDHKNPDrCBc8mhS2se3/N4jJ10tusDSgnlM3zEeqqsi8r2MIT/ErthHzD2gXURyi2cxqmkO8QmnuIKfjdkF8x73ML1hpcxwf2Dm9jG3agsyyu8L3iDz7jQ8NXKMla1167dwJm+yT5aLWVFkj0MfYLyX9KndRysCm0q4Un0BbfxqxnKdki72p1kr137gIsFryd46NKBDbzFC7yM0chyp1Y0C2gLfMMB9tOQnsAP3Iv95dTBSrYSbRxC+Sgu6n4EyNDWI8kY5zYTxKE0vPyMJQWvXa3D+hXP8S7by8QzshbXYi3xlok/wIOkG1Y9I3ViP8W9+jLRzVn7sP0DvLRexUfy5KYAAAAASUVORK5CYII=",
            "iVBORw0KGgoAAAANSUhEUgAAACUAAAAkCAYAAAAOwvOmAAACzklEQVR42s2YO2sVQRTHfzN3fEaxESOiEC0kgtipIMFGVBCRKIq9gl/AztJOy3wCRSxSWQgioiSFhSJoo6hgoYQkiKWvJO7u2JyR47J3d2b36s3AMruzO+d9/ufMQtqwgAH2AM+BBeCSejeU0ZP5DuDl+g6MyroZBJNU7bzMY0AB5MBGYGukUBZwTXxdS2UyIVzIlUXsMer78OwHYSkqLGIiLBQEGAcuADvl2bRl3lPCh3lWiOai+XiNkj2hcxj4JvsWgd2yblMsZUqMTQereuAcMCKJsR04IuvRQgVCm4FjwI4u5la8vFjO94unfkIFxtsEix4Dr4ADKkhTXF5F26RCQtDkOLAP+CECnq/TrgQbbVz+J2HqYmqtELYJrvMCMyfFsrH7rHKptbLQU1miGdhIUDQK9+4BD4GXwMUIDAv4NQJsAQqrkDmPdE9dGOwFTgO/RMnLETQzYBJ4C7wHrlhgPzAN3AJ2RQZznct9pMuNiuEbwnsUmHLAfallyOKpDsXVx2aYGhukfhY60MfE3Jkg87r/3Hl4lVAG8E6EcbKQMZzxVy21FcV16MOyCoctpaxfDUI5Sclc1axhDF+21Gcl3CdgeQhBblSZ8Q44C1wHVoCrpQ/a9k4p4bAskBSSbI0DngEnSi5ti+qBeK5qapPLVsQoU8L7phtQBgYlPgBPgQl5no6M69vAI7mfq7KKrXCFjwzUJSlTZ+SgOiOMsggUWAz3rqF6G5WZNhJivgJ3E8G4UAFf2JoPZoF56XOWpHCbyGB3qoNNrYGVh9Eg1JwciyaA18AbhWlNxLMGN9dmt2toQeZVsJqOiG9V0V9fdzq3DRrrs39bgcK+BzJvkkPpC9UKJ/1LKDp2oqhEeQIcBQ5JD/+un1Btu4qZhGN7v7bIDPqviyu500a6sVfx96WzUEG7LwpXcsGmGJDN4d/0XwY4CHwEfgLXBt0w/ga+AbksITc2rQAAAABJRU5ErkJggg=="
        ] {
            let data = Data(base64Encoded: encoded)!
            let representation = NSBitmapImageRep(data: data)!
            representation.size = image.size
            image.addRepresentation(representation)
        }
        image.isTemplate = true
        return image
    }()
}
