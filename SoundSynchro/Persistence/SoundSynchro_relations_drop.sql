/* CodeFluent Generated . TargetVersion:Default. Culture:en-US. UiCulture:en-US. Encoding:utf-8 (http://www.softfluent.com) */
set quoted_identifier OFF
GO
/* no fk for 'FK_Ply_Pla_Pla_Pla', tableName='Playlist_musics_Music' table='Playlist_musics_Music' */
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[FK_Ply_Pla_Pla_Pla]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [FK_Ply_Pla_Pla_Pla]
GO
/* no fk for 'FK_Ply_Mus_Mus_Mus', tableName='Playlist_musics_Music' table='Playlist_musics_Music' */
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[FK_Ply_Mus_Mus_Mus]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [FK_Ply_Mus_Mus_Mus]
GO
