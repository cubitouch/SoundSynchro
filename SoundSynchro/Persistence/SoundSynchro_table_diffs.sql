/* CodeFluent Generated . TargetVersion:Default. Culture:fr-FR. UiCulture:fr-FR. Encoding:utf-8 (http://www.softfluent.com) */
set quoted_identifier OFF
GO
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[FK_Ply_Mus_Mus_Mus]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [FK_Ply_Mus_Mus_Mus]
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[PK_Mus_Mus_Mus]') AND parent_obj = object_id(N'[dbo].[Music]'))
 ALTER TABLE [dbo].[Music] DROP CONSTRAINT [PK_Mus_Mus_Mus]
GO
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[FK_Ply_Mus_Mus_Mus]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [FK_Ply_Mus_Mus_Mus]
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[PK_Mus_Mus_Mus]') AND parent_obj = object_id(N'[dbo].[Music]'))
 ALTER TABLE [dbo].[Music] DROP CONSTRAINT [PK_Mus_Mus_Mus]
GO
ALTER TABLE [dbo].[Music] ADD CONSTRAINT [PK_Mus_Mus_Mus] PRIMARY KEY NONCLUSTERED
(

 [Music_id]
 ) ON [PRIMARY]
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[FK_Ply_Pla_Pla_Pla]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [FK_Ply_Pla_Pla_Pla]
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[PK_Pla_Pla_Pla]') AND parent_obj = object_id(N'[dbo].[Playlist]'))
 ALTER TABLE [dbo].[Playlist] DROP CONSTRAINT [PK_Pla_Pla_Pla]
GO
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[FK_Ply_Pla_Pla_Pla]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [FK_Ply_Pla_Pla_Pla]
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[PK_Pla_Pla_Pla]') AND parent_obj = object_id(N'[dbo].[Playlist]'))
 ALTER TABLE [dbo].[Playlist] DROP CONSTRAINT [PK_Pla_Pla_Pla]
GO
ALTER TABLE [dbo].[Playlist] ADD CONSTRAINT [PK_Pla_Pla_Pla] PRIMARY KEY NONCLUSTERED
(

 [Playlist_id]
 ) ON [PRIMARY]
/* no fk for 'PK_Ply_Pla_Mus_Ply', tableName='Playlist_musics_Music' table='Playlist_musics_Music' */
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[PK_Ply_Pla_Mus_Ply]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [PK_Ply_Pla_Mus_Ply]
GO
/* no fk for 'PK_Ply_Pla_Mus_Ply', tableName='Playlist_musics_Music' table='Playlist_musics_Music' */
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[PK_Ply_Pla_Mus_Ply]') AND parent_obj = object_id(N'[dbo].[Playlist_musics_Music]'))
 ALTER TABLE [dbo].[Playlist_musics_Music] DROP CONSTRAINT [PK_Ply_Pla_Mus_Ply]
GO
ALTER TABLE [dbo].[Playlist_musics_Music] ADD CONSTRAINT [PK_Ply_Pla_Mus_Ply] PRIMARY KEY NONCLUSTERED
(

 [Playlist_id],
 [Music_id]
 ) ON [PRIMARY]
