/* CodeFluent Generated . TargetVersion:Default. Culture:fr-FR. UiCulture:fr-FR. Encoding:utf-8 (http://www.softfluent.com) */
set quoted_identifier OFF
GO
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = 'vMusic' AND TABLE_SCHEMA = 'dbo')
DROP VIEW [dbo].[vMusic]
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = 'vPlaylist' AND TABLE_SCHEMA = 'dbo')
DROP VIEW [dbo].[vPlaylist]
GO

CREATE VIEW [dbo].[vMusic]
AS
SELECT [Music].[Music_id], [Music].[Music_title], [Music].[Music_file], [Music].[Music_thumbnail], [Music].[Music_date], [Music].[Music_type], [Music].[_rowVersion] 
    FROM [Music]
GO

CREATE VIEW [dbo].[vPlaylist]
AS
SELECT [Playlist].[Playlist_id], [Playlist].[Playlist_date], [Playlist].[Playlist_title], [Playlist].[_rowVersion] 
    FROM [Playlist]
GO

